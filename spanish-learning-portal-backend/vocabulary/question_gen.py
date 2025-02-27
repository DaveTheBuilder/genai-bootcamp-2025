import boto3
import json
from typing import Dict, List, Optional
from .vector import QuestionVectorStore
import uuid  


class QuestionGenerator:
    def __init__(self):
        """Initialize Bedrock client and vector store"""
        self.bedrock_client = boto3.client('bedrock-runtime', region_name="us-east-1")
        self.vector_store = QuestionVectorStore()
        self.model_id = "amazon.nova-lite-v1:0"


    def _invoke_bedrock(self, practice_type: str, topic: str, level: str, prompt: str) -> Optional[dict]:
        """Invoke Bedrock to generate a structured question"""
        try:
            if not prompt: 
                prompt = f"Generate a Spanish dialogue question for {practice_type} on the topic {topic} at the level of {level}. Introduction and explanation should be in english. CorrectAnswer should be number 0-3. Return the response in this JSON format:\n" \
                    "{ 'Introduction': '...', 'Conversation': '...', 'Question': '...', 'Options': ['...', '...', '...', '...'], 'correctAnswer': ..., 'explanation': '...' }"

        
            messages = [{
                "role": "user",
                "content": [{"text": prompt}]
            }]
            
            response = self.bedrock_client.converse(
                modelId=self.model_id,
                messages=messages,
                inferenceConfig={"temperature": 0.7}
            )

            response_text = response['output']['message']['content'][0]['text']
            
            # Ensure response is valid JSON
            question_data = json.loads(response_text)
            video_id = str(uuid.uuid4())  # Generate a new UUID for each question
            print(f"Level: {level}")
            self.vector_store.add_questions(level, [question_data], video_id=video_id)  # Use a proper video ID


           # print(f"Prompt: {prompt}")
           # print(f"Practice Type: {practice_type}")
           # print(f"Topic: {topic}")

           # print(f"Response: {response_text}")
            return question_data  # Return structured response
        except Exception as e:
            print(f"Error invoking Bedrock: {str(e)}")

            return None


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