import React from 'react';

import Companies from "./Companies";
import './App.css'

const App = () => {

    return (
        <div className={'App'}>
            <h1>Wall St.</h1>
            <pre>
                <h3>How to sort</h3>
                <p>
                    Sorting is done at an API level as sorting on the front-end would not scale for large datasets<br/>
                    You can sort by clicking on "Score" or on "Volatile Score", there is no indicator, but they will toggle between descending and ascending.<br/>
                    "Score" is the "total" values from swsCompanyScore.<br/>
                    "Volatile Score" is the difference between the min and max price.<br/>
                    "Volatile Score" is used as a indicator of the volatility of the stock.<br/><br/>
                </p>
                <h3>How to filter</h3>
                <p>
                    Filtering is done at an API level as filtering on the front-end would not scale of large datasets with a lot of pages.<br/>
                    You can filter by "Exchange Symbol" or by "Score" but not both.<br/>
                    You can filter by multiple values.<br/>
                </p>
                <br/>
                </pre>
            <Companies/>
        </div>

    )
}

export default App;
