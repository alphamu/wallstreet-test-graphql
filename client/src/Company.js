import React from 'react';
export default function Company(props) {
    let companies = props.companies
    let titles = props.titles
    return companies.map(company => {
        return (
            <tr key={company.company_id} id={company.company_id}>
                {
                    titles.map(t => (<td key={t}>{company[t]}</td>))
                }
            </tr>
        )
    })

}