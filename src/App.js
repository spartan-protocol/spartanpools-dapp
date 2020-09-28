import React from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Layout } from 'antd';
import 'antd/dist/antd.css'
import './App.css'

import Headbar from './ui/layout/Headbar'
import Sidebar from './ui/layout/Sidebar'

import Pools from './ui/pages/Pools'

import AddLiquidity from './ui/pages/AddLiquidity'
import Swap from './ui/pages/Swap'
import CreatePool from './ui/pages/CreatePool'
import { ContextProvider } from './context'

const { Content } = Layout;

const App = () => {

	return (
		<Router>
			<Layout>
				<ContextProvider>
					<Sidebar />
					<Headbar />
					<Layout>
						<Content>
							<div className="wrapper">
								<Switch>
									<Route path="/" exact component={Pools} />
									{/* <Route path="/dao" exact component={Dao} />
									<Route path="/earn" exact component={Earn} /> */}
									<Route path="/pools" exact component={Pools} />
									<Route path="/pool/stake" exact component={AddLiquidity} />
									<Route path="/pool/swap" exact component={Swap} />
									<Route path="/pool/create" exact component={CreatePool} />
								</Switch>
							</div>
					</Content>
				</Layout>
				</ContextProvider>
			</Layout>
		</Router>
	);
}

export default App;
