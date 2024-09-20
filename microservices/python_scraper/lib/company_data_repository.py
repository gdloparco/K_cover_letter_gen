from lib.company_data import CompanyData
import requests
from bs4 import BeautifulSoup

class CompanyDataRepository:

    def __init__(self):
        # Creating an empty list that will store all extracted values from the website
        self.extracted_values = []
            
        # Creating an empty list that will store already searched links (to avoid double searching if link is twice or more in the page)
        self.searched_links = []

    def get_company_values(self, website_url):
        response = requests.get(website_url)
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Looking for common links that may lead to company values.
        sublinks = ['about', 'values', 'our-values', 'mission', 'culture', 'team', 'careers', 'about-us', 'what-we-do', 'purpose', 'jobs', 'manifesto', 'impact', 'diversity-inclusion', 'why-join-us']
        links = soup.find_all('a', href=True)

        for link in links:

            if any(keyword in link['href'].lower() for keyword in sublinks):

                values_url = link['href']
                # print(values_url)

                if values_url.startswith('/'):
                    values_url = website_url.rstrip('/') + values_url

                # Skip this link if it has already been processed (in searched_links)
                if values_url in self.searched_links:
                    continue

                # If not, add the link to the set of processed URLs
                self.searched_links.append(values_url)
                
                # Scrape the identified link page
                values_page = requests.get(values_url)
                values_soup = BeautifulSoup(values_page.text, 'html.parser')
                # print(values_page.text)
                
                # Search for company values text in this page.
                text = values_soup.get_text()
                values = self.extract_relevant_paragraphs(text)

                # If values are found then append them to the extracted_values list
                if values:
                    self.extracted_values.append(values)
                
        # print(searched_links)

        # Extract text from the main link retrieved fromt the user and search for relevant paragraphs again
        main_page_text = soup.get_text()
        values_main = self.extract_relevant_paragraphs(main_page_text)
        
        # If values are found on the main page, append them to the extracted_values list
        if values_main:
            self.extracted_values.append(values_main)

        if self.extracted_values:
            return self.extracted_values
        else:
            return "No Company values found"


    def extract_relevant_paragraphs(self, text):
        keywords = ['value', 'values', 'our mission', 'our vision', 'our people', 'ethos', 'belief', 'our culture', 'team', 'team culture', 'we are passionate', "we're passionate", 'we are committed', "we're committed", 'you are', 'you care', 'you feel', 'we believe', 'we want', 'we offer']

        lines = text.split('\n')
        values_paragraphs = [line.strip() for line in lines if any(keyword in line.lower() for keyword in keywords)]
        return '\n'.join(values_paragraphs)
    

    def create_company_data(self, company_name, website_url):
            values = self.get_company_values(website_url)
            return CompanyData(
                company_name=company_name,
                website_url=website_url,
                extracted_values=values,
                searched_links=self.searched_links
            )



