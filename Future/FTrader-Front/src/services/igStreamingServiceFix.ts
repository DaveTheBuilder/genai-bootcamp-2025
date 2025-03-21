// Helper functions to fix IG Streaming Service issues

/**
 * Unsubscribe from all chart data subscriptions
 * @param service The IG Streaming Service instance
 */
export const unsubscribeFromAllChartData = (service: any): void => {
  try {
    // Get access to private members using any type
    const client = (service as any).client;
    const isConnected = (service as any).isConnected;
    const chartUpdateIntervals = (service as any).chartUpdateIntervals;
    const chartUpdateCallbacks = (service as any).chartUpdateCallbacks;
    const chartSubscriptions = (service as any).chartSubscriptions;

    if (!client || !isConnected) {
      console.log('Client not connected, clearing chart subscriptions');
      // Clear all chart update intervals
      chartUpdateIntervals.forEach((interval: NodeJS.Timeout) => {
        clearInterval(interval);
      });
      chartUpdateIntervals.clear();
      chartUpdateCallbacks.clear();
      chartSubscriptions.clear();
      return;
    }

    // Unsubscribe from all chart subscriptions
    chartSubscriptions.forEach((subscription: any, chartId: string) => {
      console.log(`Unsubscribing from chart data for ${chartId}`);
      try {
        client.unsubscribe(subscription);
      } catch (error) {
        console.error(`Error unsubscribing from chart data for ${chartId}:`, error);
      }
    });

    // Clear all chart update intervals
    chartUpdateIntervals.forEach((interval: NodeJS.Timeout) => {
      clearInterval(interval);
    });

    // Clear all maps
    chartUpdateIntervals.clear();
    chartUpdateCallbacks.clear();
    chartSubscriptions.clear();
    
    console.log('Unsubscribed from all chart data');
  } catch (error) {
    console.error('Error unsubscribing from all chart data:', error);
  }
};
