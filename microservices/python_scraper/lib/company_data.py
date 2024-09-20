class CompanyData:

    def __init__(self, company_name, website_url, extracted_values, searched_links):
        self.company_name = company_name
        self.website_url = website_url
        self.extracted_values = extracted_values
        self.searched_links = searched_links

    def __eq__(self, other):
        return self.__dict__ == other.__dict__
    
    def __repr__(self):
        return f"Company Data: ({self.company_name}, {self.website_url}, {self.extracted_values}, {self.searched_links})"