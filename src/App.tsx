import { useEffect, useMemo, useState } from "react";
import {
  ArrowDownToLine,
  ArrowLeft,
  ArrowRight,
  Bell,
  Check,
  ChevronRight,
  Clock3,
  Copy,
  Eye,
  Gift,
  Home,
  LogOut,
  Menu,
  MessageCircle,
  Play,
  ShieldCheck,
  User,
  Wallet,
  X,
  Zap,
} from "lucide-react";
import "./App.css";

type Page = "home" | "ads" | "withdraw" | "profile";
type AuthMode = "login" | "register";

interface Ad {
  id: number;
  title: string;
  description: string;
  reward: number;
  duration: number;
  watched: boolean;
}

interface Withdrawal {
  id: number;
  method: string;
  amount: number;
  account: string;
  status: "Pending" | "Approved" | "Rejected";
  date: string;
}

const initialAds: Ad[] = [
  {
    id: 1,
    title: "Daily App Promotion",
    description: "Watch this advertisement to earn your daily reward.",
    reward: 0.1,
    duration: 25,
    watched: false,
  },
  {
    id: 2,
    title: "Mobile Services",
    description: "Watch the complete advertisement and claim your reward.",
    reward: 0.1,
    duration: 30,
    watched: false,
  },
  {
    id: 3,
    title: "Online Store",
    description: "Support this advertiser by watching the full video.",
    reward: 0.1,
    duration: 25,
    watched: false,
  },
  {
    id: 4,
    title: "Technology Promotion",
    description: "Complete this advertisement to receive your reward.",
    reward: 0.1,
    duration: 30,
    watched: false,
  },
  {
    id: 5,
    title: "New Product",
    description: "Watch this short promotional advertisement.",
    reward: 0.1,
    duration: 25,
    watched: false,
  },
  {
    id: 6,
    title: "Digital Services",
    description: "Stay on the advertisement until the timer finishes.",
    reward: 0.1,
    duration: 30,
    watched: false,
  },
  {
    id: 7,
    title: "Business Promotion",
    description: "Complete the advertisement and earn your reward.",
    reward: 0.1,
    duration: 25,
    watched: false,
  },
  {
    id: 8,
    title: "App Showcase",
    description: "Watch this advertisement from start to finish.",
    reward: 0.1,
    duration: 30,
    watched: false,
  },
  {
    id: 9,
    title: "Service Advertisement",
    description: "Complete this short advertisement to earn.",
    reward: 0.1,
    duration: 25,
    watched: false,
  },
  {
    id: 10,
    title: "Special Promotion",
    description: "Watch the complete ad and claim $0.10.",
    reward: 0.1,
    duration: 30,
    watched: false,
  },
];

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>("login");

  const [page, setPage] = useState<Page>("home");

  const [ads, setAds] = useState<Ad[]>(initialAds);
  const [activeAd, setActiveAd] = useState<Ad | null>(null);
  const [remainingTime, setRemainingTime] = useState(0);

  const [balance, setBalance] = useState(12.4);
  const [todayEarned, setTodayEarned] = useState(0);
  const [whatsappBonus, setWhatsappBonus] = useState(false);

  const [promoCode, setPromoCode] = useState("");
  const [claimedPromoCodes, setClaimedPromoCodes] = useState<string[]>([]);

  const [referrals, setReferrals] = useState(0);
  const [verifiedReferrals, setVerifiedReferrals] = useState(0);

  const [withdrawMethod, setWithdrawMethod] = useState("EasyPaisa");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [accountName, setAccountName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");

  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);

  const [showMenu, setShowMenu] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2200);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!activeAd) return;

    if (remainingTime <= 0) {
      setAds((current) =>
        current.map((ad) =>
          ad.id === activeAd.id ? { ...ad, watched: true } : ad
        )
      );

      setBalance((value) => Number((value + activeAd.reward).toFixed(2)));
      setTodayEarned((value) =>
        Number((value + activeAd.reward).toFixed(2))
      );

      showToast(`Ad completed. +$${activeAd.reward.toFixed(2)}`);
      setActiveAd(null);

      return;
    }

    const timer = setInterval(() => {
      setRemainingTime((value) => value - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [activeAd, remainingTime]);

  function showToast(message: string) {
    setToast(message);

    setTimeout(() => {
      setToast("");
    }, 2600);
  }

  function startAd(ad: Ad) {
    if (ad.watched) {
      showToast("You have already watched this ad today.");
      return;
    }

    if (activeAd) {
      showToast("Please finish the current advertisement first.");
      return;
    }

    setActiveAd(ad);
    setRemainingTime(ad.duration);
  }

  function claimWhatsappBonus() {
    if (whatsappBonus) {
      showToast("WhatsApp bonus has already been claimed.");
      return;
    }

    setWhatsappBonus(true);

    setBalance((value) => Number((value + 1).toFixed(2)));
    setTodayEarned((value) => Number((value + 1).toFixed(2)));

    showToast("WhatsApp bonus claimed. +$1.00");
  }

  function claimPromoCode() {
    const code = promoCode.trim().toUpperCase();

    if (!code) {
      showToast("Please enter today's promo code.");
      return;
    }

    if (claimedPromoCodes.includes(code)) {
      showToast("This promo code has already been used.");
      return;
    }

    /*
      DEMO PROMO CODES

      Production version mein ye backend/database
      se verify honge.
    */

    const validPromoCodes: Record<string, number> = {
      WATCH10: 0.1,
      EARN20: 0.2,
      DAILY50: 0.5,
    };

    const reward = validPromoCodes[code];

    if (!reward) {
      showToast("Invalid or expired promo code.");
      return;
    }

    setClaimedPromoCodes((current) => [...current, code]);

    setBalance((value) => Number((value + reward).toFixed(2)));

    setTodayEarned((value) =>
      Number((value + reward).toFixed(2))
    );

    setPromoCode("");

    showToast(`Promo code claimed: +$${reward.toFixed(2)}`);
  }

  function copyReferralLink() {
    const referralLink =
      "https://watchearn.example/register?ref=WATCHUSER";

    navigator.clipboard
      .writeText(referralLink)
      .then(() => {
        showToast("Referral link copied.");
      })
      .catch(() => {
        showToast("Unable to copy referral link.");
      });
  }

  function simulateInvite() {
    setReferrals((value) => value + 1);
    showToast("Demo referral added.");
  }

  function submitWithdrawal() {
    const amount = Number(withdrawAmount);

    if (!accountName.trim()) {
      showToast("Enter account holder name.");
      return;
    }

    if (!accountNumber.trim()) {
      showToast("Enter account number.");
      return;
    }

    if (!amount || amount <= 0) {
      showToast("Enter a valid withdrawal amount.");
      return;
    }

    if (amount < 20) {
      showToast("Minimum withdrawal is $20.");
      return;
    }

    if (amount > balance) {
      showToast("Insufficient balance.");
      return;
    }

    /*
      Demo requirement.
      Real version mein backend is requirement ko verify karega.
    */

    if (verifiedReferrals < 1) {
      showToast("You need at least 1 verified referral.");
      return;
    }

    const newWithdrawal: Withdrawal = {
      id: Date.now(),
      method: withdrawMethod,
      amount,
      account: accountNumber,
      status: "Pending",
      date: new Date().toLocaleDateString(),
    };

    setWithdrawals((current) => [
      newWithdrawal,
      ...current,
    ]);

    setBalance((value) =>
      Number((value - amount).toFixed(2))
    );

    setWithdrawAmount("");
    setAccountName("");
    setAccountNumber("");

    showToast("Withdrawal request submitted.");
  }

  function logout() {
    setAuthenticated(false);
    setPage("home");
    setShowMenu(false);
    showToast("Logged out successfully.");
  }

  const watchedAds = useMemo(
    () => ads.filter((ad) => ad.watched).length,
    [ads]
  );

  const dailyProgress = Math.min((watchedAds / 10) * 100, 100);

  if (showSplash) {
    return <SplashScreen />;
  }

  if (!authenticated) {
    return (
      <AuthScreen
        mode={authMode}
        setMode={setAuthMode}
        onLogin={() => setAuthenticated(true)}
      />
    );
  }

  return (
    <div className="app-background">
      <main className="phone-shell">
        <header className="top-header">
          <button
            className="icon-button"
            onClick={() => setShowMenu(true)}
          >
            <Menu size={21} />
          </button>

          <div className="brand">
            <div className="brand-mark">W</div>

            <div>
              <strong>WatchEarn</strong>
              <span>WATCH. EARN. GROW.</span>
            </div>
          </div>

          <button
            className="icon-button notification-button"
            onClick={() =>
              showToast("No new notifications.")
            }
          >
            <Bell size={20} />
            <span />
          </button>
        </header>

        <div className="page-container">
          {page === "home" && (
            <HomePage
              balance={balance}
              todayEarned={todayEarned}
              watchedAds={watchedAds}
              dailyProgress={dailyProgress}
              whatsappBonus={whatsappBonus}
              claimWhatsappBonus={claimWhatsappBonus}
              promoCode={promoCode}
              setPromoCode={setPromoCode}
              claimPromoCode={claimPromoCode}
              referrals={referrals}
              verifiedReferrals={verifiedReferrals}
              copyReferralLink={copyReferralLink}
              simulateInvite={simulateInvite}
              goToAds={() => setPage("ads")}
              goToWithdraw={() => setPage("withdraw")}
            />
          )}

          {page === "ads" && (
            <AdsPage
              ads={ads}
              activeAd={activeAd}
              remainingTime={remainingTime}
              startAd={startAd}
            />
          )}

          {page === "withdraw" && (
            <WithdrawPage
              balance={balance}
              method={withdrawMethod}
              setMethod={setWithdrawMethod}
              amount={withdrawAmount}
              setAmount={setWithdrawAmount}
              accountName={accountName}
              setAccountName={setAccountName}
              accountNumber={accountNumber}
              setAccountNumber={setAccountNumber}
              withdrawals={withdrawals}
              submitWithdrawal={submitWithdrawal}
            />
          )}

          {page === "profile" && (
            <ProfilePage
              balance={balance}
              watchedAds={watchedAds}
              referrals={referrals}
              verifiedReferrals={verifiedReferrals}
              logout={logout}
            />
          )}
        </div>

        <BottomNavigation
          page={page}
          setPage={setPage}
        />

        {showMenu && (
          <div
            className="drawer-overlay"
            onClick={() => setShowMenu(false)}
          >
            <aside
              className="side-drawer"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="drawer-header">
                <div className="brand">
                  <div className="brand-mark">W</div>

                  <div>
                    <strong>WatchEarn</strong>
                    <span>CONTROL CENTER</span>
                  </div>
                </div>

                <button
                  className="icon-button"
                  onClick={() => setShowMenu(false)}
                >
                  <X size={20} />
                </button>
              </div>

              <div className="drawer-user">
                <div className="avatar">
                  U
                </div>

                <div>
                  <strong>WatchEarn User</strong>
                  <span>Verified Member</span>
                </div>
              </div>

              <div className="drawer-menu">
                <button
                  onClick={() => {
                    setPage("home");
                    setShowMenu(false);
                  }}
                >
                  <Home size={19} />
                  Home
                  <ChevronRight size={17} />
                </button>

                <button
                  onClick={() => {
                    setPage("ads");
                    setShowMenu(false);
                  }}
                >
                  <Eye size={19} />
                  Watch Ads
                  <ChevronRight size={17} />
                </button>

                <button
                  onClick={() => {
                    setPage("withdraw");
                    setShowMenu(false);
                  }}
                >
                  <Wallet size={19} />
                  Withdraw
                  <ChevronRight size={17} />
                </button>

                <button
                  onClick={() => {
                    setPage("profile");
                    setShowMenu(false);
                  }}
                >
                  <User size={19} />
                  Profile
                  <ChevronRight size={17} />
                </button>
              </div>

              <button
                className="drawer-logout"
                onClick={logout}
              >
                <LogOut size={19} />
                Logout
              </button>
            </aside>
          </div>
        )}

        {activeAd && (
          <div className="ad-overlay">
            <div className="ad-modal">
              <div className="ad-modal-icon">
                <Play size={25} fill="currentColor" />
              </div>

              <span className="eyebrow">
                ADVERTISEMENT
              </span>

              <h2>{activeAd.title}</h2>

              <p>
                Please keep this advertisement open until
                the timer finishes.
              </p>

              <div className="timer-circle">
                <strong>{remainingTime}</strong>
                <span>SEC</span>
              </div>

              <div className="timer-progress">
                <div
                  style={{
                    width: `${
                      ((activeAd.duration - remainingTime) /
                        activeAd.duration) *
                      100
                    }%`,
                  }}
                />
              </div>

              <span className="reward-label">
                Reward: +${activeAd.reward.toFixed(2)}
              </span>
            </div>
          </div>
        )}

        {toast && (
          <div className="toast">
            <Check size={18} />
            {toast}
          </div>
        )}
      </main>
    </div>
  );
}

function SplashScreen() {
  return (
    <div className="splash-screen">
      <div className="splash-logo">W</div>

      <h1>WatchEarn</h1>

      <p>Watch. Earn. Grow.</p>

      <div className="loading-line">
        <span />
      </div>
    </div>
  );
}

interface AuthScreenProps {
  mode: AuthMode;
  setMode: (mode: AuthMode) => void;
  onLogin: () => void;
}

function AuthScreen({
  mode,
  setMode,
  onLogin,
}: AuthScreenProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  function submit(event: React.FormEvent) {
    event.preventDefault();

    if (mode === "register" && !name.trim()) {
      return;
    }

    if (!email.trim() || !password.trim()) {
      return;
    }

    onLogin();
  }

  return (
    <div className="app-background">
      <main className="phone-shell auth-shell">
        <div className="auth-content">
          <div className="auth-brand">
            <div className="brand-mark large">W</div>

            <h1>WatchEarn</h1>

            <p>
              Watch advertisements.
              <br />
              Earn rewards.
            </p>
          </div>

          <div className="auth-card">
            <div className="auth-tabs">
              <button
                className={
                  mode === "login" ? "active" : ""
                }
                onClick={() => setMode("login")}
              >
                Login
              </button>

              <button
                className={
                  mode === "register" ? "active" : ""
                }
                onClick={() => setMode("register")}
              >
                Register
              </button>
            </div>

            <form onSubmit={submit}>
              {mode === "register" && (
                <label>
                  Full Name
                  <input
                    value={name}
                    onChange={(event) =>
                      setName(event.target.value)
                    }
                    placeholder="Your name"
                  />
                </label>
              )}

              <label>
                Email Address
                <input
                  type="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  placeholder="you@example.com"
                />
              </label>

              <label>
                Password
                <input
                  type="password"
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  placeholder="••••••••"
                />
              </label>

              <button className="primary-button">
                {mode === "login"
                  ? "Login to WatchEarn"
                  : "Create Account"}
                <ArrowRight size={18} />
              </button>
            </form>
          </div>

          <div className="auth-footer">
            <ShieldCheck size={15} />
            Secure & trusted earning platform
          </div>
        </div>
      </main>
    </div>
  );
}

interface HomePageProps {
  balance: number;
  todayEarned: number;
  watchedAds: number;
  dailyProgress: number;
  whatsappBonus: boolean;
  claimWhatsappBonus: () => void;
  promoCode: string;
  setPromoCode: (value: string) => void;
  claimPromoCode: () => void;
  referrals: number;
  verifiedReferrals: number;
  copyReferralLink: () => void;
  simulateInvite: () => void;
  goToAds: () => void;
  goToWithdraw: () => void;
}

function HomePage({
  balance,
  todayEarned,
  watchedAds,
  dailyProgress,
  whatsappBonus,
  claimWhatsappBonus,
  promoCode,
  setPromoCode,
  claimPromoCode,
  referrals,
  verifiedReferrals,
  copyReferralLink,
  simulateInvite,
  goToAds,
  goToWithdraw,
}: HomePageProps) {
  return (
    <div className="content-stack">
      <div className="welcome-row">
        <div>
          <span className="eyebrow">
            WELCOME BACK
          </span>

          <h1>Good morning</h1>

          <p>Keep earning with WatchEarn.</p>
        </div>

        <div className="verified-badge">
          <ShieldCheck size={17} />
          Verified
        </div>
      </div>

      <section className="balance-card">
        <div className="balance-card-top">
          <span>AVAILABLE BALANCE</span>

          <Wallet size={20} />
        </div>

        <strong>${balance.toFixed(2)}</strong>

        <div className="balance-bottom">
          <span>
            Today: +${todayEarned.toFixed(2)}
          </span>

          <button onClick={goToWithdraw}>
            Withdraw
            <ArrowRight size={15} />
          </button>
        </div>
      </section>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <Zap size={18} />
          </div>

          <strong>
            ${todayEarned.toFixed(2)}
          </strong>

          <span>Today's Earnings</span>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <Eye size={18} />
          </div>

          <strong>{watchedAds}/10</strong>

          <span>Ads Watched</span>
        </div>
      </div>

      <section className="progress-card">
        <div className="section-heading">
          <div>
            <span className="eyebrow">
              DAILY TARGET
            </span>

            <h3>Complete today's ads</h3>
          </div>

          <strong>{watchedAds}/10</strong>
        </div>

        <div className="progress-track">
          <div
            className="progress-fill"
            style={{ width: `${dailyProgress}%` }}
          />
        </div>

        <div className="progress-footer">
          <span>Daily earning potential</span>
          <strong>$1.00</strong>
        </div>
      </section>

      <div className="section-title-row">
        <div>
          <span className="eyebrow">QUICK ACTIONS</span>
          <h2>Start earning</h2>
        </div>
      </div>

      <div className="quick-actions">
        <button onClick={goToAds}>
          <div className="quick-icon">
            <Play size={20} fill="currentColor" />
          </div>

          <span>
            <strong>Watch Ads</strong>
            <small>Earn $0.10 per ad</small>
          </span>

          <ArrowRight size={17} />
        </button>

        <button onClick={claimWhatsappBonus}>
          <div className="quick-icon whatsapp">
            <MessageCircle size={20} />
          </div>

          <span>
            <strong>WhatsApp Bonus</strong>
            <small>
              {whatsappBonus
                ? "Already claimed"
                : "Claim $1.00 bonus"}
            </small>
          </span>

          <ChevronRight size={17} />
        </button>
      </div>

      <section className="promo-card">
        <div className="promo-header">
          <div className="promo-icon">
            <Gift size={21} />
          </div>

          <div>
            <span className="eyebrow">
              DAILY PROMO
            </span>

            <h3>Have today's code?</h3>

            <p>
              Get the latest promo code from our
              official channel.
            </p>
          </div>
        </div>

        <div className="promo-input-row">
          <input
            value={promoCode}
            onChange={(event) =>
              setPromoCode(
                event.target.value.toUpperCase()
              )
            }
            placeholder="ENTER PROMO CODE"
            maxLength={20}
          />

          <button onClick={claimPromoCode}>
            Claim
          </button>
        </div>

        <div className="promo-note">
          <Clock3 size={14} />
          Daily codes may expire after a limited time.
        </div>
      </section>

      <section className="invite-card">
        <div className="invite-top">
          <div className="invite-icon">
            <Gift size={21} />
          </div>

          <div>
            <span className="eyebrow">
              REFERRAL PROGRAM
            </span>

            <h3>Invite & Earn</h3>

            <p>
              Invite friends and grow your referral
              network.
            </p>
          </div>
        </div>

        <div className="invite-stats">
          <div>
            <strong>{referrals}</strong>
            <span>Invited</span>
          </div>

          <div>
            <strong>{verifiedReferrals}</strong>
            <span>Verified</span>
          </div>

          <div>
            <strong>1</strong>
            <span>Bonus Goal</span>
          </div>
        </div>

        <div className="referral-box">
          <span>YOUR REFERRAL LINK</span>

          <div>
            <input
              readOnly
              value="watchearn.example/register?ref=WATCHUSER"
            />

            <button onClick={copyReferralLink}>
              <Copy size={16} />
              Copy
            </button>
          </div>
        </div>

        <button
          className="demo-invite-button"
          onClick={simulateInvite}
        >
          + Add Demo Invite
        </button>
      </section>

      <section className="notice-card">
        <ShieldCheck size={20} />

        <div>
          <strong>Secure earning system</strong>

          <p>
            Your earnings, referrals and withdrawal
            records will be securely managed through
            the backend in the production version.
          </p>
        </div>
      </section>
    </div>
  );
}

interface AdsPageProps {
  ads: Ad[];
  activeAd: Ad | null;
  remainingTime: number;
  startAd: (ad: Ad) => void;
}

function AdsPage({
  ads,
  activeAd,
  remainingTime,
  startAd,
}: AdsPageProps) {
  const completed = ads.filter(
    (ad) => ad.watched
  ).length;

  return (
    <div className="content-stack">
      <div className="page-heading">
        <div>
          <span className="eyebrow">
            DAILY TASKS
          </span>

          <h1>Watch Ads</h1>

          <p>
            Complete advertisements and earn
            rewards.
          </p>
        </div>

        <div className="ads-count">
          {completed}/10
        </div>
      </div>

      <section className="ads-summary">
        <div>
          <span>Today's Progress</span>

          <strong>
            ${((completed * 0.1)).toFixed(2)}
          </strong>
        </div>

        <div className="mini-progress">
          <div
            style={{
              width: `${(completed / 10) * 100}%`,
            }}
          />
        </div>
      </section>

      <div className="ads-list">
        {ads.map((ad) => (
          <AdCard
            key={ad.id}
            ad={ad}
            active={activeAd?.id === ad.id}
            remainingTime={
              activeAd?.id === ad.id
                ? remainingTime
                : 0
            }
            onStart={() => startAd(ad)}
          />
        ))}
      </div>
    </div>
  );
}

interface AdCardProps {
  ad: Ad;
  active: boolean;
  remainingTime: number;
  onStart: () => void;
}

function AdCard({
  ad,
  active,
  remainingTime,
  onStart,
}: AdCardProps) {
  return (
    <article
      className={`ad-card ${
        ad.watched ? "completed" : ""
      }`}
    >
      <div className="ad-thumbnail">
        <Play
          size={23}
          fill="currentColor"
        />

        <span>AD</span>
      </div>

      <div className="ad-info">
        <div className="ad-info-top">
          <div>
            <span className="ad-number">
              AD #{String(ad.id).padStart(2, "0")}
            </span>

            <h3>{ad.title}</h3>
          </div>

          <strong>
            +${ad.reward.toFixed(2)}
          </strong>
        </div>

        <p>{ad.description}</p>

        <div className="ad-bottom">
          <span>
            <Clock3 size={14} />
            {ad.duration}s
          </span>

          <button
            disabled={ad.watched || active}
            onClick={onStart}
          >
            {ad.watched ? (
              <>
                <Check size={15} />
                Completed
              </>
            ) : active ? (
              <>
                <Clock3 size={15} />
                {remainingTime}s
              </>
            ) : (
              <>
                Watch
                <ArrowRight size={15} />
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
}

interface WithdrawPageProps {
  balance: number;
  method: string;
  setMethod: (value: string) => void;
  amount: string;
  setAmount: (value: string) => void;
  accountName: string;
  setAccountName: (value: string) => void;
  accountNumber: string;
  setAccountNumber: (value: string) => void;
  withdrawals: Withdrawal[];
  submitWithdrawal: () => void;
}

function WithdrawPage({
  balance,
  method,
  setMethod,
  amount,
  setAmount,
  accountName,
  setAccountName,
  accountNumber,
  setAccountNumber,
  withdrawals,
  submitWithdrawal,
}: WithdrawPageProps) {
  return (
    <div className="content-stack">
      <div className="page-heading">
        <div>
          <span className="eyebrow">
            PAYOUT CENTER
          </span>

          <h1>Withdraw</h1>

          <p>
            Request your available earnings.
          </p>
        </div>
      </div>

      <section className="withdraw-balance">
        <span>AVAILABLE TO WITHDRAW</span>

        <strong>${balance.toFixed(2)}</strong>

        <small>
          Minimum withdrawal: $20.00
        </small>
      </section>

      <section className="withdraw-card">
        <div className="form-section-title">
          <Wallet size={19} />

          <div>
            <strong>Payment Details</strong>
            <span>
              Select your preferred payment method
            </span>
          </div>
        </div>

        <div className="method-grid">
          <button
            className={
              method === "EasyPaisa"
                ? "selected"
                : ""
            }
            onClick={() =>
              setMethod("EasyPaisa")
            }
          >
            <strong>EasyPaisa</strong>
            <span>Mobile Wallet</span>
          </button>

          <button
            className={
              method === "JazzCash"
                ? "selected"
                : ""
            }
            onClick={() =>
              setMethod("JazzCash")
            }
          >
            <strong>JazzCash</strong>
            <span>Mobile Wallet</span>
          </button>
        </div>

        <label>
          Account Holder Name
          <input
            value={accountName}
            onChange={(event) =>
              setAccountName(event.target.value)
            }
            placeholder="Enter account name"
          />
        </label>

        <label>
          {method} Account Number
          <input
            value={accountNumber}
            onChange={(event) =>
              setAccountNumber(
                event.target.value
              )
            }
            placeholder="03XXXXXXXXX"
          />
        </label>

        <label>
          Withdrawal Amount
          <div className="amount-input">
            <span>$</span>

            <input
              type="number"
              min="20"
              value={amount}
              onChange={(event) =>
                setAmount(event.target.value)
              }
              placeholder="20.00"
            />
          </div>
        </label>

        <div className="withdraw-requirement">
          <ShieldCheck size={18} />

          <div>
            <strong>
              Verification requirement
            </strong>

            <p>
              At least 1 verified referral is
              required before submitting a
              withdrawal request.
            </p>
          </div>
        </div>

        <button
          className="primary-button"
          onClick={submitWithdrawal}
        >
          <ArrowDownToLine size={18} />
          Submit Withdrawal
        </button>
      </section>

      <section className="history-section">
        <div className="section-title-row">
          <div>
            <span className="eyebrow">
              TRANSACTION HISTORY
            </span>

            <h2>Withdrawals</h2>
          </div>
        </div>

        {withdrawals.length === 0 ? (
          <div className="empty-state">
            <Wallet size={28} />

            <strong>No withdrawals yet</strong>

            <span>
              Your withdrawal requests will appear
              here.
            </span>
          </div>
        ) : (
          <div className="withdrawal-list">
            {withdrawals.map((item) => (
              <div
                className="withdrawal-item"
                key={item.id}
              >
                <div className="withdrawal-icon">
                  <ArrowDownToLine size={18} />
                </div>

                <div>
                  <strong>
                    {item.method}
                  </strong>

                  <span>
                    {item.account}
                  </span>

                  <small>{item.date}</small>
                </div>

                <div className="withdrawal-right">
                  <strong>
                    -${item.amount.toFixed(2)}
                  </strong>

                  <span
                    className={`status ${item.status.toLowerCase()}`}
                  >
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

interface ProfilePageProps {
  balance: number;
  watchedAds: number;
  referrals: number;
  verifiedReferrals: number;
  logout: () => void;
}

function ProfilePage({
  balance,
  watchedAds,
  referrals,
  verifiedReferrals,
  logout,
}: ProfilePageProps) {
  return (
    <div className="content-stack">
      <div className="profile-cover">
        <div className="profile-avatar">
          U
        </div>

        <div>
          <h1>WatchEarn User</h1>

          <p>member@watchearn.com</p>
        </div>

        <div className="profile-verified">
          <ShieldCheck size={16} />
          Verified
        </div>
      </div>

      <div className="profile-stats">
        <div>
          <strong>
            ${balance.toFixed(2)}
          </strong>
          <span>Balance</span>
        </div>

        <div>
          <strong>{watchedAds}</strong>
          <span>Ads Watched</span>
        </div>

        <div>
          <strong>{referrals}</strong>
          <span>Invites</span>
        </div>
      </div>

      <section className="profile-card">
        <ProfileMenuItem
          icon={<User size={18} />}
          title="Account Information"
          subtitle="Manage your profile"
        />

        <ProfileMenuItem
          icon={<ShieldCheck size={18} />}
          title="Verification"
          subtitle={`${verifiedReferrals} verified referrals`}
        />

        <ProfileMenuItem
          icon={<Bell size={18} />}
          title="Notifications"
          subtitle="Notification preferences"
        />

        <ProfileMenuItem
          icon={<Wallet size={18} />}
          title="Payment Methods"
          subtitle="EasyPaisa / JazzCash"
        />
      </section>

      <button
        className="logout-button"
        onClick={logout}
      >
        <LogOut size={18} />
        Logout
      </button>

      <p className="version-text">
        WatchEarn v1.0.0
      </p>
    </div>
  );
}

interface ProfileMenuItemProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}

function ProfileMenuItem({
  icon,
  title,
  subtitle,
}: ProfileMenuItemProps) {
  return (
    <button className="profile-menu-item">
      <div className="profile-menu-icon">
        {icon}
      </div>

      <div>
        <strong>{title}</strong>
        <span>{subtitle}</span>
      </div>

      <ChevronRight size={18} />
    </button>
  );
}

interface BottomNavigationProps {
  page: Page;
  setPage: (page: Page) => void;
}

function BottomNavigation({
  page,
  setPage,
}: BottomNavigationProps) {
  return (
    <nav className="bottom-nav">
      <button
        className={page === "home" ? "active" : ""}
        onClick={() => setPage("home")}
      >
        <Home size={20} />
        <span>HOME</span>
      </button>

      <button
        className={page === "ads" ? "active" : ""}
        onClick={() => setPage("ads")}
      >
        <Eye size={20} />
        <span>ADS</span>
      </button>

      <button
        className={
          page === "withdraw" ? "active" : ""
        }
        onClick={() => setPage("withdraw")}
      >
        <Wallet size={20} />
        <span>WITHDRAW</span>
      </button>

      <button
        className={
          page === "profile" ? "active" : ""
        }
        onClick={() => setPage("profile")}
      >
        <User size={20} />
        <span>PROFILE</span>
      </button>
    </nav>
  );
}

export default App;