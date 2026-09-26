// Captures every page of the English build (PC 1440 + mobile 390) as JPEG into frames/
const { chromium } = require('playwright');
const fs = require('fs');
const exe = process.env.CHROME_PATH || undefined; // system Chromium path (optional)
const BASE = process.env.BASE || 'http://localhost:3100';
const OUT = __dirname + '/frames';
fs.mkdirSync(OUT, { recursive: true });

const USER = { _id: 'me', memberNick: 'justin_k', memberFullName: 'Justin Kang', memberPhone: '+82 10 9876 5432', memberAddress: 'Seoul, Mapo-gu, Yanghwa-ro 30', memberType: 'USER' };

// [id, section, title, path, login, action]
const PAGES = [
	['home', 'Home', 'Home', '/', null],
	['catalog', 'Furniture', 'Furniture Search', '/product', null],
	['catalog-filtered', 'Furniture', 'Furniture Search — filtered', '/product?type=SOFA', null],
	['detail', 'Furniture', 'Furniture Detail', '/product/detail?id=p2', 'user'],
	['detail-reviews', 'Furniture', 'Furniture Detail — Reviews', '/product/detail?id=p2', 'user', 'reviews'],
	['agents', 'Agents', 'Agents', '/agent', null],
	['agent-detail', 'Agents', 'Agent Page', '/agent/detail?id=a1', null],
	['cart', 'Cart', 'Cart & Checkout', '/cart', 'user'],
	['order-placed', 'Cart', 'Order Placed', '/cart', 'user', 'order'],
	['cart-empty', 'Cart', 'Empty Cart', '/cart', 'empty'],
	['my-orders', 'My Page', 'My Orders', '/mypage?category=orders', 'user'],
	['my-favorites', 'My Page', 'My Favorites', '/mypage?category=favorites', 'user'],
	['my-recent', 'My Page', 'Recently Visited', '/mypage?category=recent', 'user'],
	['my-followings', 'My Page', 'My Followings', '/mypage?category=followings', 'user'],
	['my-profile', 'My Page', 'My Profile', '/mypage?category=profile', 'user'],
	['community', 'Community', 'Community', '/community?articleCategory=INTERIOR', 'user'],
	['community-detail', 'Community', 'Community Detail', '/community/detail?id=b1', 'user'],
	['cs-notice', 'CS', 'CS — Notice', '/cs?tab=notice', null, 'notice'],
	['cs-faq', 'CS', 'CS — FAQ', '/cs?tab=faq', null, 'faq'],
	['cs-inquiry', 'CS', 'CS — Inquiry', '/cs?tab=inquiry', null],
	['login', 'Account', 'Login', '/account/join', null],
	['signup', 'Account', 'Signup', '/account/join', null, 'signup'],
	['about', 'Account', 'About Us', '/about', null],
	['report-product', 'Reports', 'Report Furniture — dialog', '/product/detail?id=p9&report=1', 'user', 'reportfill'],
	['report-agent', 'Reports', 'Report Agent — dialog', '/agent/detail?id=a4&report=1', 'user', 'reportfill'],
	['report-sent', 'Reports', 'Report Sent', '/product/detail?id=p9&report=1', 'user', 'reportsend'],
	['my-reports', 'Reports', 'My Page — My Reports', '/mypage?category=reports', 'user'],
	['admin-reports', 'Reports', 'Admin — Reports', '/_admin?category=reports', 'admin'],
	['admin-dashboard', 'Admin', 'Admin — Dashboard', '/_admin?category=dashboard', 'admin'],
	['admin-users', 'Admin', 'Admin — Users', '/_admin?category=users', 'admin'],
	['admin-furniture', 'Admin', 'Admin — Furniture', '/_admin?category=products', 'admin'],
	['admin-orders', 'Admin', 'Admin — Orders', '/_admin?category=orders', 'admin'],
	['admin-community', 'Admin', 'Admin — Community', '/_admin?category=community', 'admin'],
	['admin-cs', 'Admin', 'Admin — CS', '/_admin?category=cs', 'admin'],
];
// mobile-only interaction frames
const MOBILE_EXTRA = [
	['m-menu', 'Mobile UI', 'Side menu', '/', 'user', 'drawer'],
	['m-filter', 'Mobile UI', 'Filter sheet', '/product', null, 'filter'],
];

async function prep(p, login) {
	await p.goto(BASE + '/', { waitUntil: 'domcontentloaded' });
	await p.evaluate(
		([login, user]) => {
			localStorage.clear();
			if (!login) return;
			const u = { ...user, memberType: login === 'admin' ? 'ADMIN' : 'USER' };
			localStorage.setItem('accessToken', '"demo-token"');
			localStorage.setItem('member', JSON.stringify(u));
			if (login === 'empty') return;
			localStorage.setItem('cart', JSON.stringify([{ productId: 'p1', quantity: 1 }, { productId: 'p5', quantity: 2 }]));
			localStorage.setItem('liked', JSON.stringify(['p2', 'p4', 'p10', 'p8']));
			localStorage.setItem('recent', JSON.stringify(['p3', 'p8', 'p6', 'p12']));
		},
		[login, USER],
	);
}

async function act(p, action) {
	if (!action) return;
	const click = async (sel) => {
		await p.locator(sel).first().click();
		await p.waitForTimeout(500);
	};
	if (action === 'reviews') await click('button[role=tab]:has-text("Reviews")');
	if (action === 'order') await click('button:has-text("Place order")');
	if (action === 'notice') await p.evaluate(() => document.querySelector('.notice-list details')?.setAttribute('open', ''));
	if (action === 'faq') await click('.faq-list .MuiAccordionSummary-root');
	if (action === 'signup') await click('button[role=tab]:has-text("Signup")');
	if (action === 'reportfill' || action === 'reportsend') {
		if (!(await p.locator('.rd-reasons').count())) await click('.report-trigger');
		await p.locator('.rd-reasons label').first().click();
		await p.fill('#report-desc', 'The fabric in the photos is velvet, but the listing says microfiber.');
		await p.waitForTimeout(300);
		if (action === 'reportsend') await click('button:has-text("Send report")');
	}
		if (action === 'drawer') await click('button[aria-label="Menu"]');
	if (action === 'filter') await click('button.filter-btn');
}

(async () => {
	const b = await chromium.launch({ executablePath: exe });
	const manifest = [];
	for (const mode of ['pc', 'mobile']) {
		const mobile = mode === 'mobile';
		const ctx = await b.newContext({
			viewport: mobile ? { width: 390, height: 844 } : { width: 1440, height: 900 },
			isMobile: mobile,
			hasTouch: mobile,
			deviceScaleFactor: mobile ? 2 : 1,
			userAgent: mobile
				? 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'
				: undefined,
		});
		const list = mobile ? [...PAGES, ...MOBILE_EXTRA] : PAGES;
		for (const [id, section, title, path, login, action] of list) {
			const p = await ctx.newPage();
			await prep(p, login);
			await p.goto(BASE + path, { waitUntil: 'networkidle' });
			await p.waitForTimeout(700);
			await act(p, action);
			// hide the fixed tab bar in full-page shots so it doesn't float mid-page; add it back at the bottom
			const full = !['drawer', 'filter', 'reportfill', 'reportsend'].includes(action);
			const file = `${id}-${mode}.jpg`;
			if (mobile && full) {
				await p.addStyleTag({ content: '.m-tabbar{position:static!important} #mobile-wrap{padding-bottom:0!important}' });
				await p.evaluate(() => {
					const bar = document.querySelector('.m-tabbar');
					const wrap = document.querySelector('#mobile-wrap');
					if (bar && wrap) wrap.appendChild(bar);
				});
			}
			await p.waitForTimeout(300);
			await p.screenshot({ path: `${OUT}/${file}`, fullPage: full, type: 'jpeg', quality: mobile ? 72 : 78 });
			const size = await p.evaluate(() => [document.documentElement.scrollWidth, document.documentElement.scrollHeight]);
			manifest.push({ id, section, title, mode, file, w: mobile ? 390 : 1440, h: full ? size[1] : mobile ? 844 : 900 });
			console.log(mode, id, size[1]);
			await p.close();
		}
		await ctx.close();
	}
	fs.writeFileSync(`${OUT}/manifest.json`, JSON.stringify(manifest, null, 1));
	await b.close();
})();
