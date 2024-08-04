import yfinance as yf
from datetime import datetime, timedelta
from pprint import pprint
from collections import OrderedDict
import json
from flask import Flask,jsonify, Response
from flask_cors import CORS, cross_origin
import warnings
import matplotlib.pyplot as plt


app = Flask(__name__)
app.config['CORS_HEADERS'] = 'Content-Type'

warnings.filterwarnings("ignore")

@app.route('/')
@cross_origin()
def home():
    return "Welcome"

@app.route('/strategy1')
@cross_origin()
def strategy1():
    # Define the list of sector tickers
    sector_tickers = ['XHB', 'XLB', 'XLE', 'XLY', 'XLK', 'XLV', 'XLI', 'XLU', 'XLP', 'XLF', 'XLC', 'XLRE']

    # Define the start and end dates for historical data retrieval
    end_date = datetime.today()
    start_date_1_month = end_date - timedelta(days=30)
    start_date_3_months = end_date - timedelta(days=90)
    start_date_6_months = end_date - timedelta(days=180)
    start_date_9_months = end_date - timedelta(days=270)
    start_date_12_months = end_date - timedelta(days=365)

    # Initialize dictionaries to store returns for each time period
    returns={}

    # Fetch historical price data and calculate returns for each sector
    for ticker in sector_tickers:
        data = yf.download(ticker, start=start_date_12_months, end=end_date)
        price_end = data['Adj Close'][-1]
        price_start_1_month = data['Adj Close'].loc[start_date_1_month:end_date].iloc[0]
        price_start_3_months = data['Adj Close'].loc[start_date_3_months:end_date].iloc[0]
        price_start_6_months = data['Adj Close'].loc[start_date_6_months:end_date].iloc[0]
        price_start_9_months = data['Adj Close'].loc[start_date_9_months:end_date].iloc[0]
        price_start_12_months = data['Adj Close'].loc[start_date_12_months:end_date].iloc[0]

        return_1_month = ((price_end / price_start_1_month) - 1) * 100
        return_3_months = ((price_end / price_start_3_months) - 1) * 100
        return_6_months = ((price_end / price_start_6_months) - 1) * 100
        return_9_months = ((price_end / price_start_9_months) - 1) * 100
        return_12_months = ((price_end / price_start_12_months) - 1) * 100

        # returns[f"avg_return_{ticker}"] = (return_1_month + return_3_months + return_6_months + return_9_months + return_12_months) / 5
        returns[f"{ticker}"] = (return_1_month + return_3_months + return_6_months + return_9_months + return_12_months) / 5

    # Sort the dictionary by values in descending order
    sorted_dict = OrderedDict(sorted(returns.items(), key=lambda item: item[1], reverse=True))
    top_3_dict = OrderedDict(list(sorted_dict.items())[:3])
    
    # Convert the top 3 dictionary to JSON format
    top_3_json = json.dumps(top_3_dict)
    
    return Response(top_3_json, mimetype='application/json')

@app.route('/strategy2')
@cross_origin()
def strategy2():
    # Define the ticker symbol for SPY
    spy_ticker = 'SPY'
    moving_averages={}
    result=[]
    # Define the assets
    assets = ['SPY', 'EFA', 'IEF', 'BWX', 'LQD', 'TLT', 'DBC', 'GLD', 'VNQ']

    # Download historical price data for SPY
    for ticker in assets:
        data = yf.download(ticker, period='max')
        # Calculate the 10-month moving average
        data['10_MA'] = data['Close'].rolling(window=10).mean()
        print(data['10_MA'][-1])
    
        # Resample the data to end of each month and select the last value
        last_day_of_month_data = data.resample('M').last()

        # Extract the close price for the last trading day of each month
        last_day_close_price = last_day_of_month_data['Close']
        
        if last_day_close_price[-1]>data['10_MA'][-1]:
            result.append(ticker)

        # Plot the closing prices and the 10-month moving average
        plt.figure(figsize=(10, 6))
        plt.plot(data['Close'], label='SPY Close Price')
        plt.plot(data['10_MA'], label='10-Month Moving Average')
        plt.title(f'{ticker} Close Price vs. 10-Month Moving Average')
        plt.xlabel('Date')
        plt.ylabel('Price')
        plt.legend()
        plt.grid(True)

        # Save the plot as an image file without displaying it
        plt.savefig(f'{ticker}_ma_plot.png')
    
    result=json.dumps(result)
    
    return Response(result, mimetype='application/json')


# # Define the ticker symbol for SPY (S&P 500 ETF)
# spy_ticker = 'SPY'

# # Define the start and end dates for historical data retrieval
# end_date = datetime.today()
# start_date = end_date - timedelta(days=365)  # Fetch one year of historical data

# # Fetch historical price data for SPY
# spy_data = yf.download(spy_ticker, start=start_date, end=end_date)

# # Calculate the 10-month moving average
# moving_average_10_month = spy_data['Close'].rolling(window=10).mean()

# # Get the latest closing price of SPY
# latest_close_price = spy_data['Close'][-1]

# # Check if the latest closing price is below the 10-month moving average
# if latest_close_price < moving_average_10_month[-1]:
#     print("S&P 500 closes below its 10-month moving average.")
# else:
#     print("S&P 500 does not close below its 10-month moving average.")

if __name__=="__main__":
    app.run(debug=True)