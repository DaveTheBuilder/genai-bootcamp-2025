from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from .models import MLModel, Market
from .serializers import MLModelSerializer
from .tasks import train_model_task
import logging
from rest_framework.permissions import AllowAny


logger = logging.getLogger(__name__)

class MLModelViewSet(viewsets.ModelViewSet):
    queryset = MLModel.objects.all()
    serializer_class = MLModelSerializer
    permission_classes = [IsAuthenticated]  # Enforce authentication

    def list(self, request):
        """Override list method to add logging"""
        queryset = self.filter_queryset(self.get_queryset())
        logger.info(f"Fetching all ML models, found {queryset.count()}")
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def train(self, request):
        """Create and train a new ML model"""
        model_type = request.data.get('model_type')
        instrument = request.data.get('instrument')  # EPIC code
        target = request.data.get('target')
        horizon = request.data.get('horizon')
        training_period = request.data.get('training_period')

        logger.info(f"Request to train model: {model_type} for {instrument}")

        # Validate input
        if not all([model_type, instrument, target, horizon, training_period]):
            return Response({'error': 'Missing required parameters'}, status=status.HTTP_400_BAD_REQUEST)

        # Ensure market exists
        if not Market.objects.filter(epic=instrument).exists():
            return Response(
                {'error': f'Market data not found for epic: {instrument}. Please sync market data first.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Create the ML model instance
        ml_model = MLModel.objects.create(
            model_type=model_type,
            instrument=instrument,
            target=target,
            horizon=horizon,
            training_period=training_period,
            status='training',
            progress=0
        )

        logger.info(f"ML model created with ID {ml_model.id}, starting training")

        # Start the training asynchronously
        train_model_task.delay(ml_model.id)

        return Response({'id': ml_model.id, 'message': 'Model training started'}, status=status.HTTP_202_ACCEPTED)

    @action(detail=True, methods=['get'])
    def status(self, request, pk=None):
        """Check training status of a specific model"""
        try:
            model = MLModel.objects.get(id=pk)
            logger.info(f"Fetching status for model {pk}: {model.status}, progress: {model.progress}%")
            serializer = MLModelSerializer(model)
            return Response(serializer.data)
        except MLModel.DoesNotExist:
            return Response({'error': 'Model not found'}, status=status.HTTP_404_NOT_FOUND)

    
    @action(detail=True, methods=['get'])
    def details(self, request, pk=None):
        """
        Get detailed information about a model including analytics data
        """
        try:
            model = MLModel.objects.get(id=pk)
            print(f"Getting details for model {pk}: {model.model_type} on {model.instrument}")
            
            # Use the detailed serializer that includes related data
            from .serializers import MLModelDetailSerializer
            serializer = MLModelDetailSerializer(model)
            
            return Response(serializer.data)
        except MLModel.DoesNotExist:
            return Response(
                {'error': 'Model not found'},
                status=status.HTTP_404_NOT_FOUND
            )


class MLTrainViewSet(viewsets.ViewSet):
    # Temporarily disable authentication for development
    permission_classes = [AllowAny]

    @action(detail=False, methods=['post'])
    def train(self, request):
        # Check if we're training an existing model or creating a new one
        model_id = request.data.get('model_id')
        
        if model_id:
            # Training an existing model
            try:
                # Verify the model exists
                ml_model = MLModel.objects.get(id=model_id)
                print(f"MLTrainViewSet: Training existing model {model_id}")
                
                # Start the training task
                train_model_task.delay(model_id)  # Call Celery task
                return Response({'id': model_id, 'message': 'Training started'}, status=status.HTTP_202_ACCEPTED)
            
            except MLModel.DoesNotExist:
                return Response(
                    {'error': f'Model with ID {model_id} not found'},
                    status=status.HTTP_404_NOT_FOUND
                )
        else:
            # Creating and training a new model
            try:
                # Extract training parameters
                model_type = request.data.get('model_type')
                instrument = request.data.get('instrument')
                target = request.data.get('target')
                horizon = request.data.get('horizon')
                training_period = request.data.get('training_period')
                
                # Validate required parameters
                if not all([model_type, instrument, target, horizon, training_period]):
                    missing_params = []
                    if not model_type: missing_params.append('model_type')
                    if not instrument: missing_params.append('instrument')
                    if not target: missing_params.append('target')
                    if not horizon: missing_params.append('horizon')
                    if not training_period: missing_params.append('training_period')
                    
                    return Response(
                        {'error': f'Missing required parameters: {", ".join(missing_params)}'},
                        status=status.HTTP_400_BAD_REQUEST
                    )
                
                # Create a new model
                new_model = MLModel.objects.create(
                    model_type=model_type,
                    instrument=instrument,
                    target=target,
                    horizon=horizon,
                    training_period=training_period,
                    status='pending',
                    progress=0,
                    training_phase='Not started'
                )
                
                # Start the training task
                train_model_task.delay(new_model.id)
                
                return Response(
                    {'id': new_model.id, 'message': 'Model created and training started'},
                    status=status.HTTP_201_CREATED
                )
                
            except Exception as e:
                return Response(
                    {'error': f'Failed to create model: {str(e)}'},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )


class MLPredictViewSet(viewsets.ViewSet):
    # Temporarily disable authentication for development
    permission_classes = [AllowAny]

    @action(detail=False, methods=['post'])
    def predict(self, request):
        model_id = request.data.get('model_id')
        input_data = request.data.get('input_data')

        if not model_id or not input_data:
            return Response(
                {'error': 'Missing required parameters'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            # Fetch the trained model from the database
            ml_model = MLModel.objects.get(id=model_id)
            print(f"MLPredictViewSet: Making prediction with model {model_id}")
        except MLModel.DoesNotExist:
            return Response(
                {'error': 'Model not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        # Use the model to make a prediction (assuming you have a predict function)
        # For now, we'll just return a mock prediction
        prediction_result = {"prediction": 0.75, "confidence": 0.85}

        return Response(prediction_result, status=status.HTTP_200_OK)