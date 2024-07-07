from flask import Flask, send_file, request, jsonify
import quantstats as qs
from flask_cors import CORS , cross_origin
import os
import matplotlib.pyplot as plt
from datetime import datetime
import matplotlib

matplotlib.use('Agg')


app = Flask(__name__)
# CORS(app)

# Extend pandas functionality with metrics, etc.
qs.extend_pandas()

# Initialize stock data
stock = None

@app.route('/', methods=['GET'])
@cross_origin()
def index():
    return 'Welcome to the Flask API!'

@app.route('/sharpe', methods=['GET'])
@cross_origin()
def sharpe_ratio():
    # Show sharpe ratio
    if stock is not None:
        return jsonify({'sharpe_ratio': qs.stats.sharpe(stock)})
    else:
        return jsonify({'error': 'No stock data available'}), 400

@app.route('/snapshot', methods=['GET'])
@cross_origin()
def snapshot():
    # Generate snapshot plot
    if stock is not None:
        qs.plots.snapshot(stock, title=f"{ticker} Performance", savefig='snapshot.png', show=False)
        return send_file('snapshot.png', mimetype='image/png')
    else:
        return jsonify({'error': 'No stock data available'}), 400

@app.route('/cagr', methods=['GET'])
@cross_origin()
def get_cagr():
    start_date = request.args.get('start_date')
    end_date = datetime.today()

    if start_date and end_date:
        # Calculate CAGR based on user-provided dates
        cagr = stock.cagr(start_date=start_date, end_date=end_date)
        return jsonify({'cagr': cagr})
    elif stock is not None:
        # Calculate CAGR using stock's available data
        cagr = stock.cagr()
        return jsonify({'cagr': cagr})
    else:
        return jsonify({'error': 'No stock data available'}), 400
    
@app.route('/SYP', methods=['GET'])
@cross_origin()
def get_VSSYP():
    spy = qs.utils.download_returns('SPY')

    if stock is not None:
        fig, ax = plt.subplots(figsize=(10, 6))
        ax.plot(stock.index, stock, label=str(ticker))
        ax.plot(spy.index, spy, label='S&P 500')
        ax.set_title(f'{ticker} vs S&P 500 Performance')
        ax.set_xlabel('Date')
        ax.set_ylabel('Returns')
        ax.legend()
        fig.savefig('vssyp.png')
        # plt.close(fig)
        return send_file('vssyp.png', mimetype='image/png')

@app.route('/volatility', methods=['GET'])
@cross_origin()
def get_volatility():
    # Return the CAGR
    if stock is not None:
        return jsonify({'volatility': stock.volatility()})
    else:
        return jsonify({'error': 'No stock data available'}), 400   

@app.route('/sortino', methods=['GET'])
@cross_origin()
def get_sortino():
    # Return the CAGR
    if stock is not None:
        return jsonify({'sortino': stock.sortino()})
    else:
        return jsonify({'error': 'No stock data available'}), 400        

@app.route('/max_drawdown', methods=['GET'])
@cross_origin()
def get_max_drawdown():
    # Return the maximum drawdown
    if stock is not None:
        return jsonify({'max_drawdown': stock.max_drawdown()})
    else:
        return jsonify({'error': 'No stock data available'}), 400

# @app.route('/monthly_returns', methods=['GET'])
# def get_monthly_returns():
#     # Return the monthly returns
#     if stock is not None:
#         monthly_returns = stock.monthly_returns()
#         return jsonify(monthly_returns)
#     else:
#         return jsonify({'error': 'No stock data available'}), 400

@app.route('/stock', methods=['POST'])
@cross_origin()
def set_stock():
    global ticker
    # ticker = request.json.get('symbol')
    ticker = 'XHB'
    if ticker:
        global stock
        stock = None  # Reset the stock data
        try:
            stock = qs.utils.download_returns(ticker)
            return jsonify({'message': f'Stock data fetched for {ticker}'}), 200
        except Exception as e:
            if str(e) == f"'{ticker}': No timezone found, symbol may be delisted":
                return jsonify({'error': f"The ticker '{ticker}' doesn't exist or may be delisted."}), 400
            else:
                return jsonify({'error': str(e)}), 400
    else:
        return jsonify({'error': 'Invalid request'}), 400

if __name__ == '__main__':
    from werkzeug.serving import run_simple
    app.run(debug=True, port=8000)