import React from 'react';
import {Cell} from "@blueprintjs/table";
import {gql} from "apollo-boost";

import "normalize.css"
import "@blueprintjs/core/lib/css/blueprint.css"
import "@blueprintjs/icons/lib/css/blueprint-icons.css"
import "@blueprintjs/table/lib/css/table.css"
import Companies from "./Companies";


const App = () => {

    return (
            <div>
                <h2>My first Apollo app 🚀</h2>
                <Companies />
            </div>

    )
}

export default App;
