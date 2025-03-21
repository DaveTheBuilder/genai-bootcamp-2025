from django.db import models
from django.contrib.auth import get_user_model
from market_data.models import Market

User = get_user_model()


class Portfolio(models.Model):
    """
    Model to store user portfolios
    """
    name = models.CharField(max_length=100)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='portfolios')
    is_default = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ('name', 'user')
    
    def __str__(self):
        return f"{self.user.username}'s {self.name} portfolio"


class PortfolioItem(models.Model):
    """
    Model to store portfolio items
    """
    portfolio = models.ForeignKey(Portfolio, on_delete=models.CASCADE, related_name='items')
    market = models.ForeignKey(Market, on_delete=models.CASCADE, related_name='portfolio_items')
    quantity = models.DecimalField(max_digits=15, decimal_places=5)
    average_price = models.DecimalField(max_digits=15, decimal_places=5)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ('portfolio', 'market')
    
    def __str__(self):
        return f"{self.portfolio.name} - {self.market.name} ({self.quantity})"
    
    @property
    def current_value(self):
        """
        Calculate the current value of the portfolio item
        """
        return self.quantity * self.market.bid
    
    @property
    def profit_loss(self):
        """
        Calculate the profit/loss of the portfolio item
        """
        return self.current_value - (self.quantity * self.average_price)
    
    @property
    def profit_loss_percentage(self):
        """
        Calculate the profit/loss percentage of the portfolio item
        """
        cost_basis = self.quantity * self.average_price
        if cost_basis == 0:
            return 0
        return (self.profit_loss / cost_basis) * 100


class PortfolioTransaction(models.Model):
    """
    Model to store portfolio transactions
    """
    TRANSACTION_TYPE_CHOICES = (
        ('BUY', 'Buy'),
        ('SELL', 'Sell'),
        ('DIVIDEND', 'Dividend'),
        ('SPLIT', 'Split'),
        ('MERGER', 'Merger'),
        ('OTHER', 'Other'),
    )
    
    portfolio = models.ForeignKey(Portfolio, on_delete=models.CASCADE, related_name='transactions')
    market = models.ForeignKey(Market, on_delete=models.CASCADE, related_name='portfolio_transactions')
    transaction_type = models.CharField(max_length=10, choices=TRANSACTION_TYPE_CHOICES)
    quantity = models.DecimalField(max_digits=15, decimal_places=5)
    price = models.DecimalField(max_digits=15, decimal_places=5)
    total_amount = models.DecimalField(max_digits=15, decimal_places=2)
    currency = models.CharField(max_length=3, default='USD')
    transaction_date = models.DateTimeField()
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.portfolio.name} - {self.transaction_type} {self.quantity} {self.market.name} at {self.price}"
    
    def save(self, *args, **kwargs):
        # Calculate total amount if not provided
        if not self.total_amount:
            self.total_amount = self.quantity * self.price
        
        # Call the original save method
        super().save(*args, **kwargs)
        
        # Update the portfolio item
        self.update_portfolio_item()
    
    def update_portfolio_item(self):
        """
        Update the portfolio item based on the transaction
        """
        portfolio_item, created = PortfolioItem.objects.get_or_create(
            portfolio=self.portfolio,
            market=self.market,
            defaults={
                'quantity': 0,
                'average_price': 0,
            }
        )
        
        if self.transaction_type == 'BUY':
            # Calculate new average price
            total_cost = (portfolio_item.quantity * portfolio_item.average_price) + self.total_amount
            new_quantity = portfolio_item.quantity + self.quantity
            
            if new_quantity > 0:
                portfolio_item.average_price = total_cost / new_quantity
            
            portfolio_item.quantity = new_quantity
        
        elif self.transaction_type == 'SELL':
            # Reduce quantity
            portfolio_item.quantity -= self.quantity
            
            # If quantity becomes zero or negative, reset average price
            if portfolio_item.quantity <= 0:
                portfolio_item.quantity = 0
                portfolio_item.average_price = 0
        
        # Save the portfolio item
        portfolio_item.save()


class PortfolioPerformance(models.Model):
    """
    Model to store portfolio performance snapshots
    """
    portfolio = models.ForeignKey(Portfolio, on_delete=models.CASCADE, related_name='performance_history')
    date = models.DateField()
    total_value = models.DecimalField(max_digits=15, decimal_places=2)
    daily_change = models.DecimalField(max_digits=15, decimal_places=2)
    daily_change_percentage = models.DecimalField(max_digits=10, decimal_places=2)
    
    class Meta:
        unique_together = ('portfolio', 'date')
    
    def __str__(self):
        return f"{self.portfolio.name} performance on {self.date}"
