import React, { useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import FurnitureArt from '../../libs/components/common/FurnitureArt';
import { logIn, signUp } from '../../libs/auth';
import { MemberType } from '../../libs/enums/member.enum';
import { IS_DEMO } from '../../apollo/client';

/** Nestar: account/join — login va signup (JWT) */
const Join: NextPage = () => {
	const router = useRouter();
	const [mode, setMode] = useState<'login' | 'signup'>('login');
	const [nick, setNick] = useState('');
	const [password, setPassword] = useState('');
	const [phone, setPhone] = useState('');
	const [type, setType] = useState<MemberType>(MemberType.USER);
	const [show, setShow] = useState(false);
	const [error, setError] = useState('');
	const [busy, setBusy] = useState(false);

	const submit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError('');
		if (password.length < 6) {
			setError("Parol kamida 6 ta belgidan iborat bo'lsin.");
			return;
		}
		setBusy(true);
		try {
			if (mode === 'login') await logIn(nick, password);
			else await signUp(nick, password, phone, type);
			router.push((router.query.next as string) || '/mypage');
		} catch (err: any) {
			setError(err?.message || 'Kirishda xatolik. Qayta urinib ko‘ring.');
		} finally {
			setBusy(false);
		}
	};

	return (
		<div className="join-page">
			<div className="container">
				<div className="join-box">
					<div className="join-art">
						<FurnitureArt type="ARMCHAIR" color="#c9a27a" variant={1} />
						<div className="quote">
							<strong>«Uy — bu divan emas, lekin divansiz uy ham yo'q.»</strong>
							<span>Sevimlilar, buyurtmalar tarixi va sotuvchilarga obuna — bitta hisobda.</span>
						</div>
					</div>
					<form className="join-form" onSubmit={submit}>
						<div className="switch" role="tablist">
							<button type="button" role="tab" aria-selected={mode === 'login'} className={mode === 'login' ? 'active' : ''} onClick={() => setMode('login')}>
								Kirish
							</button>
							<button type="button" role="tab" aria-selected={mode === 'signup'} className={mode === 'signup' ? 'active' : ''} onClick={() => setMode('signup')}>
								Ro'yxatdan o'tish
							</button>
						</div>
						<h2>{mode === 'login' ? 'Xush kelibsiz!' : 'Yangi hisob ochish'}</h2>
						<div className="form-field">
							<label htmlFor="join-nick">Foydalanuvchi nomi</label>
							<input id="join-nick" required autoComplete="username" value={nick} onChange={(e) => setNick(e.target.value)} placeholder="masalan: aziz_n" />
						</div>
						{mode === 'signup' && (
							<div className="form-field">
								<label htmlFor="join-phone">Telefon raqam</label>
								<input id="join-phone" required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+998 90 123 45 67" />
							</div>
						)}
						<div className="form-field">
							<label htmlFor="join-password">Parol</label>
							<div className="password">
								<input
									id="join-password"
									required
									type={show ? 'text' : 'password'}
									autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
									value={password}
									onChange={(e) => setPassword(e.target.value)}
								/>
								<button type="button" onClick={() => setShow(!show)} aria-label={show ? 'Parolni yashirish' : "Parolni ko'rsatish"}>
									{show ? <VisibilityOffOutlinedIcon /> : <VisibilityOutlinedIcon />}
								</button>
							</div>
						</div>
						{mode === 'signup' && (
							<div className="form-field">
								<span>Hisob turi</span>
								<div className="type-row">
									<label className={type === MemberType.USER ? 'active' : ''}>
										<input type="radio" name="mtype" checked={type === MemberType.USER} onChange={() => setType(MemberType.USER)} />
										Xaridor
									</label>
									<label className={type === MemberType.AGENT ? 'active' : ''}>
										<input type="radio" name="mtype" checked={type === MemberType.AGENT} onChange={() => setType(MemberType.AGENT)} />
										Sotuvchi
									</label>
								</div>
							</div>
						)}
						{error && <p className="error">{error}</p>}
						<button type="submit" className="btn-accent" disabled={busy}>
							{busy ? 'Kuting…' : mode === 'login' ? 'Kirish' : "Ro'yxatdan o'tish"}
						</button>
						<p className="note">
							<LockOutlinedIcon /> Kirish JWT token orqali: server sessiya saqlamaydi.
							{IS_DEMO && ' Demo rejim: istalgan nom va 6+ belgili parol bilan kiring.'}
						</p>
					</form>
				</div>
			</div>
		</div>
	);
};

export default withLayoutBasic(Join);
