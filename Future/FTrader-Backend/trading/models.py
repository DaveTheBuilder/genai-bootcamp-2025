from django.db import models
from django.contrib.auth import get_user_model
from market_data.models import Market

User = get_user_model()


class Position(models.Model):
    """
    Model to store trading positions
    """
    DIRECTION_CHOICES = (
        ('BUY', 'Buy'),
        ('SELL', 'Sell'),
    )
    
    STATUS_CHOICES = (
        ('OPEN', 'Open'),
        ('CLOSED', 'Closed'),
        ('PENDING', 'Pending'),
        ('REJECTED', 'Rejected'),
        ('CANCELLED', 'Cancelled'),
    )
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='positions')
    market = models.ForeignKey(Market, on_delete=models.CASCADE, related_name='positions')
    deal_id = models.CharField(max_length=100, unique=True, blank=True, null=True)
    deal_reference = models.CharField(max_length=100, blank=True, null=True)
    direction = models.CharField(max_length=4, choices=DIRECTION_CHOICES)
    size = models.DecimalField(max_digits=15, decimal_places=2)
    open_level = models.DecimalField(max_digits=15, decimal_places=5)
    close_level = models.DecimalField(max_digits=15, decimal_places=5, blank=True, null=True)
    limit_level = models.DecimalField(max_digits=15, decimal_places=5, blank=True, null=True)
    stop_level = models.DecimalField(max_digits=15, decimal_places=5, blank=True, null=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='PENDING')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    opened_at = models.DateTimeField(blank=True, null=True)
    closed_at = models.DateTimeField(blank=True, null=True)
    profit_loss = models.DecimalField(max_digits=15, decimal_places=2, blank=True, null=True)
    currency = models.CharField(max_length=3, default='USD')
    
    def __str__(self):
        return f"{self.user.username}'s {self.direction} position on {self.market.name}"


class Order(models.Model):
    """
    Model to store trading orders
    """
    ORDER_TYPE_CHOICES = (
        ('LIMIT', 'Limit'),
        ('MARKET', 'Market'),
        ('STOP', 'Stop'),
    )
    
    DIRECTION_CHOICES = (
        ('BUY', 'Buy'),
        ('SELL', 'Sell'),
    )
    
    STATUS_CHOICES = (
        ('PENDING', 'Pending'),
        ('EXECUTED', 'Executed'),
        ('REJECTED', 'Rejected'),
        ('CANCELLED', 'Cancelled'),
        ('EXPIRED', 'Expired'),
    )
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='orders')
    market = models.ForeignKey(Market, on_delete=models.CASCADE, related_name='orders')
    deal_id = models.CharField(max_length=100, unique=True, blank=True, null=True)
    deal_reference = models.CharField(max_length=100, blank=True, null=True)
    order_type = models.CharField(max_length=6, choices=ORDER_TYPE_CHOICES)
    direction = models.CharField(max_length=4, choices=DIRECTION_CHOICES)
    size = models.DecimalField(max_digits=15, decimal_places=2)
    level = models.DecimalField(max_digits=15, decimal_places=5)
    limit_distance = models.DecimalField(max_digits=15, decimal_places=5, blank=True, null=True)
    stop_distance = models.DecimalField(max_digits=15, decimal_places=5, blank=True, null=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='PENDING')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    executed_at = models.DateTimeField(blank=True, null=True)
    expiry = models.DateTimeField(blank=True, null=True)
    good_till_date = models.DateTimeField(blank=True, null=True)
    position = models.ForeignKey(Position, on_delete=models.SET_NULL, blank=True, null=True, related_name='orders')
    
    def __str__(self):
        return f"{self.user.username}'s {self.order_type} {self.direction} order on {self.market.name}"


class Transaction(models.Model):
    """
    Model to store transaction history
    """
    TRANSACTION_TYPE_CHOICES = (
        ('OPEN_POSITION', 'Open Position'),
        ('CLOSE_POSITION', 'Close Position'),
        ('EDIT_POSITION', 'Edit Position'),
        ('CREATE_ORDER', 'Create Order'),
        ('EDIT_ORDER', 'Edit Order'),
        ('CANCEL_ORDER', 'Cancel Order'),
        ('DEPOSIT', 'Deposit'),
        ('WITHDRAWAL', 'Withdrawal'),
        ('FEE', 'Fee'),
        ('INTEREST', 'Interest'),
        ('DIVIDEND', 'Dividend'),
        ('OTHER', 'Other'),
    )
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='transactions')
    transaction_type = models.CharField(max_length=20, choices=TRANSACTION_TYPE_CHOICES)
    position = models.ForeignKey(Position, on_delete=models.SET_NULL, blank=True, null=True, related_name='transactions')
    order = models.ForeignKey(Order, on_delete=models.SET_NULL, blank=True, null=True, related_name='transactions')
    market = models.ForeignKey(Market, on_delete=models.SET_NULL, blank=True, null=True, related_name='transactions')
    amount = models.DecimalField(max_digits=15, decimal_places=2)
    currency = models.CharField(max_length=3, default='USD')
    reference = models.CharField(max_length=100, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.user.username}'s {self.transaction_type} transaction of {self.amount} {self.currency}"


class Trade(models.Model):
    """
    Model to store executed trades
    """
    DIRECTION_CHOICES = (
        ('BUY', 'Buy'),
        ('SELL', 'Sell'),
    )
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='trades')
    market = models.ForeignKey(Market, on_delete=models.CASCADE, related_name='trades')
    position = models.ForeignKey(Position, on_delete=models.CASCADE, related_name='trades', null=True, blank=True)
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='trades', null=True, blank=True)
    trade_id = models.CharField(max_length=100, unique=True)
    direction = models.CharField(max_length=4, choices=DIRECTION_CHOICES)
    size = models.DecimalField(max_digits=15, decimal_places=2)
    price = models.DecimalField(max_digits=15, decimal_places=5)
    timestamp = models.DateTimeField(auto_now_add=True)
    commission = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    profit_loss = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    currency = models.CharField(max_length=3, default='USD')
    
    def __str__(self):
        return f"{self.user.username}'s {self.direction} trade on {self.market.name} at {self.price}"
