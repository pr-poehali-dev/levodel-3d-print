import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface Prize {
  id: number;
  name: string;
  icon: string;
  chance: number;
  color: string;
  discount?: number;
  isDiscount: boolean;
}

interface WonPrize {
  id: string;
  prizeId: number;
  name: string;
  promoCode: string;
  discount: number;
  expiresAt: number;
}

const prizes: Prize[] = [
  { id: 1, name: 'Скидка 20%', icon: 'Tag', chance: 20, color: 'bg-green-500', discount: 20, isDiscount: true },
  { id: 2, name: 'Скидка 15%', icon: 'Tag', chance: 20, color: 'bg-blue-500', discount: 15, isDiscount: true },
  { id: 3, name: 'Скидка 25%', icon: 'Tag', chance: 20, color: 'bg-purple-500', discount: 25, isDiscount: true },
  { id: 4, name: 'iPhone 17 Pro Max', icon: 'Smartphone', chance: 0, color: 'bg-red-500', isDiscount: false },
  { id: 5, name: 'Скидка 30%', icon: 'Percent', chance: 15, color: 'bg-yellow-500', discount: 30, isDiscount: true },
  { id: 6, name: '3D принтер Bambu', icon: 'Box', chance: 0, color: 'bg-orange-500', isDiscount: false },
  { id: 7, name: 'Скидка 10%', icon: 'Tag', chance: 15, color: 'bg-pink-500', discount: 10, isDiscount: true },
  { id: 8, name: 'Tesla Model 3', icon: 'Car', chance: 0, color: 'bg-indigo-500', isDiscount: false },
  { id: 9, name: 'Скидка 35%', icon: 'BadgePercent', chance: 10, color: 'bg-emerald-500', discount: 35, isDiscount: true },
];

const SPIN_COST = 3;
const DAILY_BONUS = 10;
const TELEGRAM_BONUS = 50;

export default function Roulette() {
  const navigate = useNavigate();
  const [balance, setBalance] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [wonPrizes, setWonPrizes] = useState<WonPrize[]>([]);
  const [lastDailyLogin, setLastDailyLogin] = useState<string | null>(null);
  const [telegramSubscribed, setTelegramSubscribed] = useState(false);
  const [showPrizeModal, setShowPrizeModal] = useState(false);
  const [currentWonPrize, setCurrentWonPrize] = useState<WonPrize | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const savedBalance = localStorage.getItem('plasticBalance');
    const savedLastLogin = localStorage.getItem('lastDailyLogin');
    const savedTgSub = localStorage.getItem('telegramSubscribed');
    const savedPrizes = localStorage.getItem('wonPrizes');
    
    if (savedBalance) setBalance(parseInt(savedBalance));
    if (savedLastLogin) setLastDailyLogin(savedLastLogin);
    if (savedTgSub) setTelegramSubscribed(savedTgSub === 'true');
    if (savedPrizes) setWonPrizes(JSON.parse(savedPrizes));
    
    const today = new Date().toDateString();
    if (savedLastLogin !== today) {
      const newBalance = (savedBalance ? parseInt(savedBalance) : 0) + DAILY_BONUS;
      setBalance(newBalance);
      setLastDailyLogin(today);
      localStorage.setItem('plasticBalance', newBalance.toString());
      localStorage.setItem('lastDailyLogin', today);
      
      toast({
        title: '🎁 Ежедневный бонус!',
        description: `Вы получили ${DAILY_BONUS} Пластика за вход`,
      });
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setWonPrizes((prev) => {
        const filtered = prev.filter((p) => p.expiresAt > Date.now());
        localStorage.setItem('wonPrizes', JSON.stringify(filtered));
        return filtered;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleTelegramSubscribe = () => {
    window.open('https://t.me/levo_del', '_blank');
    
    setTimeout(() => {
      const newBalance = balance + TELEGRAM_BONUS;
      setBalance(newBalance);
      setTelegramSubscribed(true);
      localStorage.setItem('plasticBalance', newBalance.toString());
      localStorage.setItem('telegramSubscribed', 'true');
      
      toast({
        title: '🎉 Бонус за подписку!',
        description: `Вы получили ${TELEGRAM_BONUS} Пластика!`,
      });
    }, 2000);
  };

  const selectWinningPrize = (): number => {
    const random = Math.random() * 100;
    let cumulative = 0;
    
    for (let i = 0; i < prizes.length; i++) {
      cumulative += prizes[i].chance;
      if (random <= cumulative) {
        return i;
      }
    }
    
    return 0;
  };

  const generatePromoCode = () => {
    return 'SPIN' + Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const formatTime = (ms: number) => {
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const spinRoulette = () => {
    if (balance < SPIN_COST) {
      toast({
        title: '❌ Недостаточно Пластика',
        description: `Нужно ${SPIN_COST} Пластика для прокрутки`,
        variant: 'destructive',
      });
      return;
    }

    setIsSpinning(true);
    const newBalance = balance - SPIN_COST;
    setBalance(newBalance);
    localStorage.setItem('plasticBalance', newBalance.toString());

    const winningIndex = selectWinningPrize();
    const itemAngle = 360 / prizes.length;
    const baseSpins = 5;
    const targetAngle = baseSpins * 360 + (winningIndex * itemAngle) + itemAngle / 2;
    
    setRotation(targetAngle);

    setTimeout(() => {
      setIsSpinning(false);
      const wonPrize = prizes[winningIndex];

      if (wonPrize.isDiscount && wonPrize.discount) {
        const newPrize: WonPrize = {
          id: Date.now().toString(),
          prizeId: wonPrize.id,
          name: wonPrize.name,
          promoCode: generatePromoCode(),
          discount: wonPrize.discount,
          expiresAt: Date.now() + 24 * 60 * 60 * 1000,
        };
        
        const updatedPrizes = [...wonPrizes, newPrize];
        setWonPrizes(updatedPrizes);
        localStorage.setItem('wonPrizes', JSON.stringify(updatedPrizes));
        setCurrentWonPrize(newPrize);
        setShowPrizeModal(true);
      } else {
        toast({
          title: '🎊 Поздравляем!',
          description: `Вы выиграли: ${wonPrize.name}! Свяжитесь с нами для получения приза.`,
        });
      }
    }, 5000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-purple-50/20 to-background py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <Button
            onClick={() => navigate('/')}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Icon name="ArrowLeft" size={20} />
            Главное меню
          </Button>
          
          <div className="inline-flex items-center gap-3 bg-white px-6 py-3 rounded-full shadow-lg border-2 border-purple-200">
            <Icon name="Sparkles" size={24} className="text-yellow-500" />
            <span className="text-2xl font-bold text-gray-800">{balance} Пластика</span>
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            🎰 Колесо Фортуны
          </h1>
          <p className="text-lg text-gray-600">
            Крутите рулетку и выигрывайте скидки! 1 прокрутка = {SPIN_COST} Пластика
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          <Card className="lg:col-span-2 overflow-hidden border-4 border-purple-200">
            <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
              <CardTitle className="text-center text-2xl">🎯 Призовое колесо</CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="relative">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 z-10">
                  <div className="w-0 h-0 border-l-[25px] border-r-[25px] border-t-[40px] border-l-transparent border-r-transparent border-t-red-500 drop-shadow-2xl"></div>
                </div>

                <div className="overflow-hidden rounded-2xl bg-gray-100 p-4">
                  <div 
                    className="flex transition-transform duration-5000 ease-out"
                    style={{ 
                      transform: `translateX(-${rotation % (prizes.length * 160)}px)`,
                      transitionTimingFunction: 'cubic-bezier(0.17, 0.67, 0.12, 0.99)'
                    }}
                  >
                    {[...prizes, ...prizes, ...prizes, ...prizes].map((prize, index) => (
                      <div
                        key={index}
                        className={`${prize.color} text-white p-6 rounded-xl mx-2 flex-shrink-0 w-[150px] h-[150px] flex flex-col items-center justify-center text-center shadow-lg`}
                      >
                        <Icon name={prize.icon} size={40} className="mb-2" />
                        <span className="font-bold text-sm">{prize.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="text-center mt-6">
                <Button
                  onClick={spinRoulette}
                  disabled={isSpinning || balance < SPIN_COST}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-6 text-xl font-bold rounded-full shadow-lg disabled:opacity-50"
                >
                  {isSpinning ? (
                    <>
                      <Icon name="Loader2" size={24} className="animate-spin mr-2" />
                      Крутим...
                    </>
                  ) : (
                    <>
                      <Icon name="Sparkles" size={24} className="mr-2" />
                      Крутить за {SPIN_COST} Пластика
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="border-2 border-green-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="ShoppingBag" className="text-green-500" />
                  Корзина призов
                </CardTitle>
              </CardHeader>
              <CardContent>
                {wonPrizes.length === 0 ? (
                  <p className="text-gray-500 text-sm text-center py-4">
                    Выигранные призы появятся здесь
                  </p>
                ) : (
                  <div className="space-y-3">
                    {wonPrizes.map((prize) => (
                      <div
                        key={prize.id}
                        className="bg-green-50 border-2 border-green-200 rounded-lg p-3"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-bold text-green-900">{prize.name}</p>
                            <p className="text-xs text-green-700 font-mono bg-white px-2 py-1 rounded mt-1 inline-block">
                              {prize.promoCode}
                            </p>
                          </div>
                          <Icon name="Gift" className="text-green-600" size={24} />
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Icon name="Clock" size={16} className="text-gray-600" />
                          <span className="font-mono text-gray-700">
                            {formatTime(prize.expiresAt - Date.now())}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-2 border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="Gift" className="text-blue-500" />
                  Бонусы
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm">
                  {lastDailyLogin === new Date().toDateString() ? (
                    <span className="text-green-600 font-medium">✅ Ежедневный бонус получен</span>
                  ) : (
                    <span className="text-gray-600">Зайдите завтра за {DAILY_BONUS} Пластика</span>
                  )}
                </div>
                
                {!telegramSubscribed && (
                  <Button
                    onClick={handleTelegramSubscribe}
                    className="w-full bg-blue-500 hover:bg-blue-600"
                  >
                    <Icon name="Send" size={18} className="mr-2" />
                    Подписаться на Telegram (+{TELEGRAM_BONUS})
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {showPrizeModal && currentWonPrize && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-md w-full border-4 border-green-400 shadow-2xl">
            <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
              <CardTitle className="text-center text-2xl">🎉 Поздравляем!</CardTitle>
            </CardHeader>
            <CardContent className="p-6 text-center">
              <div className="mb-4">
                <Icon name="Gift" size={64} className="mx-auto text-green-500 mb-3" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {currentWonPrize.name}
                </h3>
                <p className="text-gray-600 mb-4">
                  Ваш промокод действителен 24 часа
                </p>
                <div className="bg-green-50 border-2 border-green-300 rounded-lg p-4 mb-4">
                  <p className="text-sm text-gray-600 mb-1">Промокод:</p>
                  <p className="text-2xl font-mono font-bold text-green-700">
                    {currentWonPrize.promoCode}
                  </p>
                </div>
                <p className="text-sm text-gray-600">
                  Используйте его при оформлении заказа для получения скидки {currentWonPrize.discount}%
                </p>
              </div>
              <Button
                onClick={() => setShowPrizeModal(false)}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                Отлично!
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
