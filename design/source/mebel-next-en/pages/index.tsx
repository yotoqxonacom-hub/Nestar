import { NextPage } from 'next';
import useDeviceDetect from '../libs/hooks/useDeviceDetect';
import withLayoutMain from '../libs/components/layout/LayoutHome';
import {
	Advertisement,
	Categories,
	Collections,
	CommunityBoards,
	PopularProducts,
	TopAgents,
	TopProducts,
	TrendProducts,
} from '../libs/components/homepage/Sections';

const Home: NextPage = () => {
	const device = useDeviceDetect();

	if (device === 'mobile') {
		return (
			<div className="home-page">
				<Categories />
				<TrendProducts />
				<Advertisement />
				<PopularProducts />
				<TopAgents />
				<CommunityBoards />
			</div>
		);
	}

	return (
		<div className="home-page">
			<Categories />
			<TrendProducts />
			<PopularProducts />
			<Advertisement />
			<TopProducts />
			<TopAgents />
			<Collections />
			<CommunityBoards />
		</div>
	);
};

export default withLayoutMain(Home);
