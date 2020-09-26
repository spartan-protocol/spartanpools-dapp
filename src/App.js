import React from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Layout } from 'antd';
import 'antd/dist/antd.css'
import './App.css'

import Wallet from './ui/layout/Wallet'
import Sidebar from './ui/layout/Sidebar'

// import SimpleSwap from './ui/pages/SimpleSwap'
// import SimpleStake from './ui/pages/SimpleStake'
// import Dao from './ui/pages/DAO'
// import Earn from './ui/pages/Earn'

// import Overview from './ui/pages/Overview'
import Pools from './ui/pages/Pools'
//  import CDPs from './ui/pages/CDPs'
// import PriceAnchor from './ui/pages/PriceAnchor'
// import About from './ui/pages/About'

import Stake from './ui/pages/NewStake'
import Swap from './ui/pages/NewSwap'
import CreatePool from './ui/pages/CreatePool'
// import ManageCDP from './ui/pages/manageCDP'
// import OpenCDP from './ui/pages/openCDP'
import { ContextProvider } from './context'

const { Content } = Layout;

const App = () => {

	return (
		<Router>
			<Layout>
				<ContextProvider>
					<Sidebar />
					<Wallet />
					<Layout>
						<Content>
							<Switch>
								<Route path="/" exact component={Pools} />
								{/* <Route path="/swap" exact component={SimpleSwap} />
								<Route path="/stake" exact component={SimpleStake} /> */}
								{/* <Route path="/dao" exact component={Dao} />
								<Route path="/earn" exact component={Earn} /> */}
								<Route path="/pools" exact component={Pools} />
								{/* <Route path="/CDPs" exact component={CDPs} /> */}
								{/* <Route path="/anchor" exact component={PriceAnchor} /> */}
								{/* <Route path="/about" exact component={About} /> */}
								<Route path="/pool/stake" exact component={Stake} />
								<Route path="/pool/swap" exact component={Swap} />
								{/* <Route path="/cdp/manageCDP" exact component={ManageCDP}/> */}
								{/* <Route path="/cdp/openCDP" exact component={OpenCDP}/> */}
								<Route path="/pool/create" exact component={CreatePool} />
							</Switch>
					</Content>
				</Layout>
				</ContextProvider>
			</Layout>
		</Router>
	);
}

export default App;
