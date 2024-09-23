import { CompanyDetailsFormData } from '@/components/CompanyDetailsForm';

export function sendCompanyData(data: CompanyDetailsFormData) {
  console.log(data)
  const apiEndpoint = 'http://localhost:8083/formdata/company';

  fetch(apiEndpoint, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
      },
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .then((response) => {
        console.log(response)
      // alert(response.message);
    })
    .catch((err) => {
      alert(err);
    });
}