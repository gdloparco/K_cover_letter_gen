import requests
from bs4 import BeautifulSoup

# Creating an empty list that will store all extracted values from the website
extracted_values = []
    
# Creating an empty set that will store already searched links (to avoid double searching if link is twice or more in the page)
processed_links = set()

def get_company_values(homepage_url):
    response = requests.get(homepage_url)
    soup = BeautifulSoup(response.text, 'html.parser')
    
    # Looking for common links that may lead to company values.
    sublinks = ['about', 'values', 'mission', 'culture', 'team', 'careers', 'about-us', 'what-we-do', 'purpose', 'jobs', 'manifesto', 'impact']
    links = soup.find_all('a', href=True)



    for link in links:

        if any(keyword in link['href'].lower() for keyword in sublinks):

            values_url = link['href']
            # print(values_url)

            if values_url.startswith('/'):
                values_url = homepage_url.rstrip('/') + values_url

            # Skip this link if it has already been processed (in processed_links)
            if values_url in processed_links:
                continue

            # If not, add the link to the set of processed URLs
            processed_links.add(values_url)
            
            # Scrape the identified link page
            values_page = requests.get(values_url)
            values_soup = BeautifulSoup(values_page.text, 'html.parser')
            # print(values_page.text)
            
            # Search for company values text in this page.
            text = values_soup.get_text()
            values = extract_relevant_paragraphs(text)

            # If values are found then append them to the extracted_values list
            if values:
                extracted_values.append(values)
            
    # print(processed_links)

    # Extract text from the main link retrieved fromt the user and search for relevant paragraphs again
    main_page_text = soup.get_text()
    values_main = extract_relevant_paragraphs(main_page_text)
    
    # If values are found on the main page, append them to the extracted_values list
    if values_main:
        extracted_values.append(values_main)

    if extracted_values:
        return extracted_values
    else:
        return "No Company values found"


def extract_relevant_paragraphs(text):
    keywords = ['value', 'values', 'our mission', 'our vision', 'our people', 'ethos', 'belief', 'our culture', 'team', 'team culture', 'we are passionate', "we're passionate", 'we are committed', "we're committed", 'you are', 'you care', 'you feel', 'we believe', 'we want', 'we offer']

    lines = text.split('\n')
    values_paragraphs = [line.strip() for line in lines if any(keyword in line.lower() for keyword in keywords)]
    return '\n'.join(values_paragraphs)

# In future usage link will come from the backend when calling for this Python Microservice and extracted data will be sent back to the backend via JSON.

homepage_url = 'https://octopus.energy/careers/'

company_values = get_company_values(homepage_url)

print(f"FOUND {len(company_values)} COMPANY VALUES:\n")
print(company_values)

print(f"\nFROM THE FOLLOWING LINKS:\n {processed_links}:\n")



