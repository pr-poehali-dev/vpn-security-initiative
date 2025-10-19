import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const Index = () => {
  const [activeSection, setActiveSection] = useState('main');
  const [showLogin, setShowLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const BACKEND_URL = 'https://functions.poehali.dev/37c29e5e-db5b-46a6-a4dd-bdbbb27bfeb2';
  const REDIRECT_URI = window.location.origin + '/auth/callback';

  useEffect(() => {
    const savedUser = localStorage.getItem('vpn_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    if (code) {
      handleGoogleCallback(code);
    }
  }, []);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}?redirect_uri=${encodeURIComponent(REDIRECT_URI)}`);
      const data = await response.json();
      window.location.href = data.auth_url;
    } catch (error) {
      console.error('Google login error:', error);
      setIsLoading(false);
    }
  };

  const handleGoogleCallback = async (code: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(BACKEND_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, redirect_uri: REDIRECT_URI })
      });
      const data = await response.json();
      
      if (data.user) {
        localStorage.setItem('vpn_user', JSON.stringify(data.user));
        localStorage.setItem('vpn_token', data.access_token);
        setUser(data.user);
        setShowLogin(false);
        window.history.replaceState({}, document.title, '/');
      }
    } catch (error) {
      console.error('Google callback error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('vpn_user');
    localStorage.removeItem('vpn_token');
    setUser(null);
  };

  const features = [
    {
      icon: 'Shield',
      title: 'ШИФРОВАНИЕ',
      description: 'AES-256 военного уровня защищает все ваши данные',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: 'Globe',
      title: 'ГЕОГРАФИЯ',
      description: '75+ серверов в 50 странах мира',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      icon: 'Zap',
      title: 'СКОРОСТЬ',
      description: 'До 10 Гбит/с без ограничений трафика',
      gradient: 'from-orange-500 to-red-500'
    },
    {
      icon: 'Smartphone',
      title: 'МУЛЬТИПЛАТФОРМА',
      description: 'Windows, macOS, iOS, Android, Linux',
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      icon: 'Lock',
      title: 'ПРИВАТНОСТЬ',
      description: 'Строгая политика No-logs, RAM-only серверы',
      gradient: 'from-indigo-500 to-blue-500'
    },
    {
      icon: 'Headphones',
      title: 'ПОДДЕРЖКА',
      description: '24/7 техническая поддержка на русском языке',
      gradient: 'from-pink-500 to-rose-500'
    }
  ];

  const servers = [
    { country: 'США', servers: 25, ping: 12 },
    { country: 'Германия', servers: 15, ping: 8 },
    { country: 'Япония', servers: 12, ping: 45 },
    { country: 'Сингапур', servers: 10, ping: 52 },
    { country: 'Великобритания', servers: 8, ping: 15 },
  ];

  const faqItems = [
    {
      question: 'Что такое VPN и зачем он нужен?',
      answer: 'VPN (Virtual Private Network) создает зашифрованный туннель между вашим устройством и интернетом, защищая ваши данные от перехвата и обеспечивая анонимность в сети.'
    },
    {
      question: 'Насколько безопасно использовать VPN?',
      answer: 'Мы используем шифрование AES-256 военного уровня и строгую политику No-logs. Все серверы работают только на RAM, данные не сохраняются на жестких дисках.'
    },
    {
      question: 'Влияет ли VPN на скорость интернета?',
      answer: 'Наша инфраструктура обеспечивает скорость до 10 Гбит/с. В большинстве случаев снижение скорости минимально и незаметно при повседневном использовании.'
    },
    {
      question: 'Можно ли использовать VPN на нескольких устройствах?',
      answer: 'Да, одна подписка позволяет подключить до 10 устройств одновременно на любых платформах: Windows, macOS, iOS, Android, Linux.'
    },
  ];

  const navItems = [
    { id: 'main', label: 'Главная', icon: 'Home' },
    { id: 'servers', label: 'Серверы', icon: 'Server' },
    { id: 'security', label: 'Безопасность', icon: 'Shield' },
    { id: 'download', label: 'Скачать', icon: 'Download' },
    { id: 'support', label: 'Поддержка', icon: 'MessageCircle' },
    { id: 'faq', label: 'FAQ', icon: 'HelpCircle' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-neon-blue to-neon-purple rounded-lg flex items-center justify-center animate-glow">
                <Icon name="Shield" className="text-white" size={24} />
              </div>
              <span className="text-2xl font-heading font-bold bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent">
                SecureVPN
              </span>
            </div>
            
            <div className="hidden md:flex items-center gap-8">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`flex items-center gap-2 transition-colors ${
                    activeSection === item.id
                      ? 'text-primary'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Icon name={item.icon as any} size={18} />
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
            </div>

            {user ? (
              <div className="flex items-center gap-3">
                <img src={user.picture} alt={user.name} className="w-10 h-10 rounded-full border-2 border-primary" />
                <span className="font-medium">{user.name}</span>
                <Button 
                  onClick={handleLogout}
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary/10"
                >
                  Выйти
                </Button>
              </div>
            ) : (
              <Button 
                onClick={() => setShowLogin(!showLogin)}
                className="bg-gradient-to-r from-neon-blue to-neon-purple hover:opacity-90 transition-opacity"
              >
                {showLogin ? 'Закрыть' : 'Начать'}
              </Button>
            )}
          </div>
        </div>
      </nav>

      <main className="pt-20">
        <section className="relative overflow-hidden py-32">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent" />
          <div className="absolute inset-0">
            <div className="absolute top-20 left-20 w-72 h-72 bg-neon-blue/20 rounded-full blur-3xl animate-float" />
            <div className="absolute bottom-20 right-20 w-96 h-96 bg-neon-purple/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
          </div>

          <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-4xl mx-auto text-center animate-fade-in-up">
              <h1 className="text-6xl md:text-7xl font-heading font-bold mb-6 bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink bg-clip-text text-transparent">
                Свобода и безопасность в интернете
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Защитите свои данные с помощью передовых технологий шифрования. 
                Подключайтесь к серверам по всему миру за секунды.
              </p>
              <div className="flex gap-4 justify-center">
                <Button size="lg" className="bg-gradient-to-r from-neon-blue to-neon-purple hover:opacity-90 transition-opacity text-lg px-8 animate-glow">
                  <Icon name="Download" className="mr-2" size={20} />
                  Скачать бесплатно
                </Button>
                <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/10 text-lg px-8">
                  Узнать больше
                </Button>
              </div>
              
              {showLogin && !user && (
                <Card className="mt-8 p-8 bg-card/80 backdrop-blur-xl border-primary/30 max-w-md mx-auto animate-fade-in">
                  <h3 className="text-2xl font-heading font-bold mb-6 text-center">Вход в аккаунт</h3>
                  <div className="space-y-4">
                    <Button 
                      onClick={handleGoogleLogin}
                      disabled={isLoading}
                      className="w-full bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 py-6 text-lg flex items-center justify-center gap-3"
                    >
                      <svg className="w-6 h-6" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      {isLoading ? 'Загрузка...' : 'Войти через Google'}
                    </Button>
                    
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-border"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-card text-muted-foreground">или с email</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Email</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="example@email.com"
                        className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Пароль</label>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                      />
                    </div>
                    <Button className="w-full bg-gradient-to-r from-neon-blue to-neon-purple hover:opacity-90 transition-opacity py-6 text-lg">
                      <Icon name="LogIn" className="mr-2" size={20} />
                      Войти
                    </Button>
                    <div className="text-center">
                      <a href="#" className="text-sm text-primary hover:underline">Забыли пароль?</a>
                    </div>
                  </div>
                </Card>
              )}
              
              {user && (
                <Card className="mt-8 p-8 bg-card/80 backdrop-blur-xl border-primary/30 max-w-md mx-auto animate-fade-in text-center">
                  <div className="flex flex-col items-center gap-4">
                    <img src={user.picture} alt={user.name} className="w-24 h-24 rounded-full border-4 border-primary" />
                    <div>
                      <h3 className="text-2xl font-heading font-bold">{user.name}</h3>
                      <p className="text-muted-foreground">{user.email}</p>
                    </div>
                    <div className="flex items-center gap-2 text-green-500">
                      <Icon name="CheckCircle" size={20} />
                      <span className="font-medium">Аккаунт подтверждён</span>
                    </div>
                    <Button className="w-full bg-gradient-to-r from-neon-blue to-neon-purple hover:opacity-90 transition-opacity py-6 text-lg mt-4">
                      <Icon name="Shield" className="mr-2" size={20} />
                      Подключиться к VPN
                    </Button>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </section>

        <section className="py-20 relative">
          <div className="container mx-auto px-6">
            <h2 className="text-4xl font-heading font-bold text-center mb-16 animate-fade-in">
              Ключевые возможности
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <Card
                  key={index}
                  className="p-6 bg-card/50 backdrop-blur-sm border-border hover:border-primary/50 transition-all duration-300 hover:scale-105 group animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 group-hover:animate-float`}>
                    <Icon name={feature.icon as any} className="text-white" size={28} />
                  </div>
                  <h3 className="text-xl font-heading font-bold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-card/30">
          <div className="container mx-auto px-6">
            <h2 className="text-4xl font-heading font-bold text-center mb-4">
              Серверы по всему миру
            </h2>
            <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
              75+ серверов в 50 странах обеспечивают стабильное и быстрое подключение
            </p>
            <div className="max-w-3xl mx-auto">
              {servers.map((server, index) => (
                <Card
                  key={index}
                  className="p-6 mb-4 bg-card/50 backdrop-blur-sm border-border hover:border-primary/50 transition-all duration-300 hover:scale-[1.02] animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center">
                        <Icon name="MapPin" className="text-white" size={24} />
                      </div>
                      <div>
                        <h3 className="text-xl font-heading font-semibold">{server.country}</h3>
                        <p className="text-sm text-muted-foreground">{server.servers} серверов</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2">
                        <Icon name="Activity" className="text-green-500" size={20} />
                        <span className="text-2xl font-bold text-green-500">{server.ping}ms</span>
                      </div>
                      <p className="text-sm text-muted-foreground">пинг</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-6">
            <h2 className="text-4xl font-heading font-bold text-center mb-4">
              Часто задаваемые вопросы
            </h2>
            <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
              Ответы на популярные вопросы о работе VPN
            </p>
            <div className="max-w-3xl mx-auto">
              <Accordion type="single" collapsible className="w-full">
                {faqItems.map((item, index) => (
                  <AccordionItem key={index} value={`item-${index}`} className="border-border">
                    <AccordionTrigger className="text-left text-lg font-heading font-semibold hover:text-primary">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>

        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-primary/10 via-transparent to-transparent" />
          <div className="container mx-auto px-6 relative z-10">
            <Card className="p-12 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-xl border-primary/30 text-center max-w-4xl mx-auto animate-fade-in">
              <h2 className="text-4xl font-heading font-bold mb-4">
                Начните защищать свои данные прямо сейчас
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Бесплатная пробная версия на 7 дней. Без привязки карты.
              </p>
              <Button size="lg" className="bg-gradient-to-r from-neon-blue to-neon-purple hover:opacity-90 transition-opacity text-lg px-12 animate-glow">
                <Icon name="Download" className="mr-2" size={20} />
                Скачать для всех платформ
              </Button>
            </Card>
          </div>
        </section>
      </main>

      <footer className="py-12 border-t border-border bg-card/30">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-neon-blue to-neon-purple rounded-lg flex items-center justify-center">
                <Icon name="Shield" className="text-white" size={20} />
              </div>
              <span className="text-xl font-heading font-bold bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent">
                SecureVPN
              </span>
            </div>
            <p className="text-muted-foreground">© 2025 SecureVPN. Все права защищены.</p>
            <div className="flex gap-4">
              <Icon name="Github" className="text-muted-foreground hover:text-foreground cursor-pointer transition-colors" size={24} />
              <Icon name="Twitter" className="text-muted-foreground hover:text-foreground cursor-pointer transition-colors" size={24} />
              <Icon name="Mail" className="text-muted-foreground hover:text-foreground cursor-pointer transition-colors" size={24} />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;