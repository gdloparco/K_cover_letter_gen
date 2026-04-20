from flask import Flask, request, jsonify
from lib.company_data_repository import CompanyDataRepository
from lib.resume_extractor import extract_resume_text
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
        "raw_company_values": company_data.extracted_values,
        "searched_links": company_data.searched_links,
    })


@app.route('/extract-resume', methods=['POST'])
def extract_resume():
    if 'resume' not in request.files:
        return jsonify({"error": "resume file is required"}), 400

    file = request.files['resume']
    if file.filename == '':
        return jsonify({"error": "no file selected"}), 400

    try:
        file_bytes = file.read()
        text = extract_resume_text(file_bytes, file.filename)
        return jsonify({"resume_text": text})
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": f"Failed to extract text: {str(e)}"}), 500


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=int(os.environ.get('PYTHON_SCRAPER_PORT', 8085)))
