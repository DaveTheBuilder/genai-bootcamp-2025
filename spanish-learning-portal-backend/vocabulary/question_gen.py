import boto3
import json
from typing import Dict, List, Optional
from .vector import QuestionVectorStore
import uuid  
import logging
import traceback
import os

logger = logging.getLogger(__name__)

class QuestionGenerator:
    def __init__(self):
        """Initialize Bedrock client and vector store"""
        self.has_bedrock = False
        try:
            # Log AWS credentials availability (without exposing the actual values)
            aws_key = os.environ.get('AWS_ACCESS_KEY_ID')
            aws_secret = os.environ.get('AWS_SECRET_ACCESS_KEY')
            aws_region = os.environ.get('AWS_REGION', 'us-east-1')
            
            logger.info(f"AWS credentials check - Key: {'Available' if aws_key else 'Missing'}, "
                        f"Secret: {'Available' if aws_secret else 'Missing'}, "
                        f"Region: {aws_region}")
            
            # Create the Bedrock client for checking available models
            self.bedrock_client = boto3.client('bedrock', region_name=aws_region)
            
            # Create the Bedrock runtime client for invoking models
            self.bedrock_runtime = boto3.client('bedrock-runtime', region_name=aws_region)
            
            # Test if the client works by listing available models
            try:
                # Use a simple API call to test connectivity
                models = self.bedrock_client.list_foundation_models()
                available_models = [m['modelId'] for m in models.get('modelSummaries', [])]
                logger.info(f"Successfully connected to AWS Bedrock. Available models: {len(available_models)}")
                
                # Use the specific model that we know works
                self.model_id = "amazon.nova-lite-v1:0"
                
                # Check if our model is available
                if self.model_id in available_models:
                    logger.info(f"Using model: {self.model_id}")
                    self.has_bedrock = True
                else:
                    logger.warning(f"Model {self.model_id} is not available. Falling back to mock data.")
                    self.has_bedrock = False
                    
            except Exception as e:
                logger.error(f"AWS Bedrock connectivity test failed: {str(e)}")
                logger.error(traceback.format_exc())
                self.has_bedrock = False
                
        except Exception as e:
            logger.error(f"Failed to initialize Bedrock client: {str(e)}")
            logger.error(traceback.format_exc())
            self.has_bedrock = False
        
        self.vector_store = QuestionVectorStore()


    def _invoke_bedrock(self, practice_type: str, topic: str, level: str, prompt: str) -> Optional[dict]:
        """Invoke Bedrock to generate a structured question"""
        try:
            if not self.has_bedrock:
                logger.warning("Bedrock client not available, using fallback mock data")
                return self._generate_mock_question(practice_type, topic, level)
                
            if not prompt: 
                prompt = f"""Generate a Spanish dialogue question for {practice_type} on the topic {topic} at the level of {level}. 
                Introduction and explanation should be in English. CorrectAnswer should be number 0-3. 
                Return the response in this JSON format:
                {{
                  "Introduction": "...",
                  "Conversation": "...",
                  "Question": "...",
                  "Options": ["...", "...", "...", "..."],
                  "correctAnswer": 0,
                  "explanation": "..."
                }}"""

            logger.info(f"Attempting to invoke Bedrock with model: {self.model_id}")
            
            # Create message payload for the nova model
            messages = [{
                "role": "user",
                "content": [{"text": prompt}]
            }]
            
            # Invoke the model using the converse method
            response = self.bedrock_runtime.converse(
                modelId=self.model_id,
                messages=messages,
                inferenceConfig={"temperature": 0.7}
            )
            
            # Extract the response text
            response_text = response['output']['message']['content'][0]['text']
            logger.info(f"Successfully received response from Bedrock: {response_text[:100]}...")
            
            # Parse the JSON response
            try:
                # Find JSON content in the response (it might be embedded in other text)
                start_idx = response_text.find('{')
                end_idx = response_text.rfind('}') + 1
                
                if start_idx >= 0 and end_idx > start_idx:
                    json_str = response_text[start_idx:end_idx]
                    question_data = json.loads(json_str)
                else:
                    raise ValueError("No JSON content found in response")
                
                # Validate the question data
                required_fields = ["Introduction", "Conversation", "Question", "Options", "correctAnswer"]
                for field in required_fields:
                    if field not in question_data:
                        logger.warning(f"Missing required field in response: {field}")
                        question_data[field] = "Not provided" if field != "Options" else ["Option 1", "Option 2", "Option 3", "Option 4"]
                
                if not isinstance(question_data["Options"], list) or len(question_data["Options"]) != 4:
                    question_data["Options"] = ["Option 1", "Option 2", "Option 3", "Option 4"]
                
                if not isinstance(question_data["correctAnswer"], int) or question_data["correctAnswer"] < 0 or question_data["correctAnswer"] > 3:
                    question_data["correctAnswer"] = 0
                
                # Store the question in the vector store
                video_id = str(uuid.uuid4())
                logger.info(f"Storing question for level: {level}")
                self.vector_store.add_questions(level, [question_data], video_id=video_id)
                
                return question_data
            except Exception as e:
                logger.error(f"Error parsing JSON from response: {str(e)}")
                logger.error(f"Response text: {response_text}")
                return self._generate_mock_question(practice_type, topic, level)
                
        except Exception as e:
            logger.error(f"Error invoking Bedrock: {str(e)}")
            logger.error(traceback.format_exc())
            # Fall back to mock data
            return self._generate_mock_question(practice_type, topic, level)

    def _generate_mock_question(self, practice_type: str, topic: str, level: str) -> Dict:
        """Generate a mock question for development/testing"""
        logger.info(f"Generating mock question for {practice_type} on {topic} at {level} level")
        
        # Create a simple mock question based on the inputs
        mock_question = {
            "Introduction": f"This is a mock {level} level Spanish conversation about {topic}.",
            "Conversation": "María: Hola, ¿cómo estás?\nJuan: Estoy bien, gracias. ¿Y tú?\nMaría: Muy bien. ¿Qué hiciste ayer?\nJuan: Fui al cine con mis amigos.",
            "Question": f"What did Juan do yesterday?",
            "Options": [
                "He went to the cinema with friends",
                "He stayed at home",
                "He went to work",
                "He visited his family"
            ],
            "correctAnswer": 0,
            "explanation": "Juan said 'Fui al cine con mis amigos' which means 'I went to the cinema with my friends'."
        }
        
        return mock_question

    def generate_similar_question(self, practice_type: str, topic: str, level: str, prompt: str) -> Dict:
        """Generate a new question similar to existing ones on a given topic"""
        # Get similar questions for context
        similar_questions = self.vector_store.search_similar_questions(level, topic, n_results=3)
        
        if not similar_questions:
            return None
        
        # Create context from similar questions
        context = "Here are some example Spanish listening questions:\n\n"
        for idx, q in enumerate(similar_questions, 1):
            context += f"Example {idx}:\n"
            context += f"Introduction: {q.get('Introduction', '')}\n"
            context += f"Conversation: {q.get('Conversation', '')}\n"
            context += f"Question: {q.get('Question', '')}\n"
            if 'Options' in q:
                context += "Options:\n"
                for i, opt in enumerate(q['Options'], 1):
                    context += f"{i}. {opt}\n"
            context += "\n"


        # Create prompt for generating new question
        prompt = f"""Based on the following example Spanish listening questions, create a new question about {topic}.
        The question should follow the same format and {practice_type} but be different from the examples.
        Make sure the question tests listening comprehension and has a clear correct answer. 
        Introduction and explanation should be in English. CorrectAnswer should be number 0-3. 
        Return the response in this JSON format:
        {{
            "Introduction": "...",
            "Conversation": "...",
            "Question": "...",
            "Options": ["...", "...", "...", "..."],
            "correctAnswer": ...,
            "explanation": "..."
        }}"""

        # Add context to the prompt
        prompt += f"\n{context}\n"
       # print(f"Prompt: {prompt}")
       # print(f"Practice Type: {practice_type}")
        print(f"Generate a new question similar Topic: {topic}")
        print(f"Generate a new question similar Level: {level}")        
        # Generate new question
        response = self._invoke_bedrock(practice_type, topic, level, prompt) 



        return response 

       # if not response:
       #     return None

        # Parse the generated question
        # try:
        #     lines = response.strip().split('\n')
        #     question = {}
        #     current_key = None
        #     current_value = []
            
        #     for line in lines:
        #         line = line.strip()
        #         if not line:
        #             continue
                    
        #         if line.startswith("Introduction:"):
        #             if current_key:
        #                 question[current_key] = ' '.join(current_value)
        #             current_key = 'Introduction'
        #             current_value = [line.replace("Introduction:", "").strip()]
        #         elif line.startswith("Conversation:"):
        #             if current_key:
        #                 question[current_key] = ' '.join(current_value)
        #             current_key = 'Conversation'
        #             current_value = [line.replace("Conversation:", "").strip()]
        #         elif line.startswith("Situation:"):
        #             if current_key:
        #                 question[current_key] = ' '.join(current_value)
        #             current_key = 'Situation'
        #             current_value = [line.replace("Situation:", "").strip()]
        #         elif line.startswith("Question:"):
        #             if current_key:
        #                 question[current_key] = ' '.join(current_value)
        #             current_key = 'Question'
        #             current_value = [line.replace("Question:", "").strip()]
        #         elif line.startswith("Options:"):
        #             if current_key:
        #                 question[current_key] = ' '.join(current_value)
        #             current_key = 'Options'
        #             current_value = []
        #         elif line[0].isdigit() and line[1] == "." and current_key == 'Options':
        #             current_value.append(line[2:].strip())
        #         elif current_key:
        #             current_value.append(line)
            
        #     if current_key:
        #         if current_key == 'Options':
        #             question[current_key] = current_value
        #         else:
        #             question[current_key] = ' '.join(current_value)
            
        #     # Ensure we have exactly 4 options
        #     if 'Options' not in question or len(question.get('Options', [])) != 4:
        #         # Use default options if we don't have exactly 4
        #         question['Options'] = [
        #             "Opción 1",
        #             "Opción 2",
        #             "Opción 3",
        #             "Opción 4"
        #         ]
            
        #     return question
        # except Exception as e:
        #     print(f"Error parsing generated question: {str(e)}")
        #     return None

    def get_feedback(self, question: Dict, selected_answer: int) -> Dict:
        """Generate feedback for the selected answer"""
        if not question or 'Options' not in question:
            return None

        # Create prompt for generating feedback
        prompt = f"""Given this Spanish listening question and the selected answer, provide feedback explaining if it's correct 
        and why. Keep the explanation clear and concise.
        
        """
        if 'Introduction' in question:
            prompt += f"Introduction: {question['Introduction']}\n"
            prompt += f"Conversation: {question['Conversation']}\n"
        else:
            prompt += f"Situation: {question['Situation']}\n"
        
        prompt += f"Question: {question['Question']}\n"
        prompt += "Options:\n"
        for i, opt in enumerate(question['Options'], 1):
            prompt += f"{i}. {opt}\n"
        
        prompt += f"\nSelected Answer: {selected_answer}\n"
        prompt += "\nProvide feedback in JSON format with these fields:\n"
        prompt += "- correct: true/false\n"
        prompt += "- explanation: brief explanation of why the answer is correct/incorrect\n"
        prompt += "- correct_answer: the number of the correct option (1-4)\n"

        # Get feedback
        response = self._invoke_bedrock(prompt)
        if not response:
            return None

        try:
            # Parse the JSON response
            feedback = json.loads(response.strip())
            return feedback
        except:
            # If JSON parsing fails, return a basic response with a default correct answer
            return {
                "correct": False,
                "explanation": "Unable to generate detailed feedback. Please try again.",
                "correct_answer": 1  # Default to first option
            }