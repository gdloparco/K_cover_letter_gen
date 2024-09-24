from flask import Flask, request, jsonify
from lib.company_data_repository import CompanyDataRepository
import os

app = Flask(__name__)
repository = CompanyDataRepository()

@app.route('/get-company-values', methods=['POST'])
def get_company_values():
    data = request.json
    company_name = data.get('company_name')
    website_url = data.get('company_website_url')

    if not company_name or not website_url:
        return jsonify({"error": "company_name and company_website_url are required"}), 400

    company_data = repository.create_company_data(company_name, website_url)

    return jsonify({
        "company_name": company_data.company_name,
        "company_website_url": company_data.website_url,
        "extracted_values": company_data.extracted_values,
        "searched_links": company_data.searched_links,
    })

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=int(os.environ.get('PYTHON_SCRAPER_PORT', 8085)))