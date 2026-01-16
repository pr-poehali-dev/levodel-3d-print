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

interface Winner {
  id: string;
  name: string;
  prize: string;
  timeAgo: string;
}

const prizes: Prize[] = [
  { id: 1, name: 'Скидка 30% на услуги', icon: 'Wrench', chance: 25, color: 'bg-blue-600', discount: 30, isDiscount: true },
  { id: 2, name: 'Скидка 20% на прототипы', icon: 'Box', chance: 20, color: 'bg-green-600', discount: 20, isDiscount: true },
  { id: 3, name: 'Скидка 30% на игрушки', icon: 'Gamepad2', chance: 20, color: 'bg-pink-600', discount: 30, isDiscount: true },
  { id: 4, name: 'Бесплатное 3D сканирование', icon: 'Scan', chance: 10, color: 'bg-purple-600', discount: 100, isDiscount: true },
  { id: 5, name: 'Скидка 15% на моделирование', icon: 'PenTool', chance: 15, color: 'bg-yellow-600', discount: 15, isDiscount: true },
  { id: 6, name: 'Скидка 25% на фигурки', icon: 'Paintbrush', chance: 10, color: 'bg-orange-600', discount: 25, isDiscount: true },
];

const SPIN_COST = 3;
const DAILY_BONUS = 10;
const TELEGRAM_BONUS = 50;

const fakeWinners: Winner[] = [
  { id: '1', name: 'Светлана Н.', prize: 'Скидка 30% на услуги', timeAgo: '3 минуты назад' },
  { id: '2', name: 'Дмитрий К.', prize: 'Бесплатное 3D сканирование', timeAgo: '12 минут назад' },
  { id: '3', name: 'Анна М.', prize: 'Скидка 20% на прототипы', timeAgo: '25 минут назад' },
  { id: '4', name: 'Игорь В.', prize: 'Скидка 30% на игрушки', timeAgo: '34 минуты назад' },
  { id: '5', name: 'Елена П.', prize: 'Скидка 25% на фигурки', timeAgo: '41 минута назад' },
  { id: '6', name: 'Максим Р.', prize: 'Скидка 15% на моделирование', timeAgo: '58 минут назад' },
  { id: '7', name: 'Ольга С.', prize: 'Скидка 30% на услуги', timeAgo: '1 час назад' },
  { id: '8', name: 'Александр Т.', prize: 'Бесплатное 3D сканирование', timeAgo: '1 час 15 минут назад' },
  { id: '9', name: 'Мария Л.', prize: 'Скидка 20% на прототипы', timeAgo: '1 час 32 минуты назад' },
  { id: '10', name: 'Сергей Б.', prize: 'Скидка 30% на игрушки', timeAgo: '2 часа назад' },
];

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
  const [recentWinners, setRecentWinners] = useState<Winner[]>([]);
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

  useEffect(() => {
    const shuffled = [...fakeWinners].sort(() => Math.random() - 0.5);
    setRecentWinners(shuffled.slice(0, 3));

    const winnerInterval = setInterval(() => {
      const randomWinner = fakeWinners[Math.floor(Math.random() * fakeWinners.length)];
      setRecentWinners((prev) => {
        const newWinners = [randomWinner, ...prev.slice(0, 2)];
        return newWinners;
      });
    }, Math.random() * (80 - 20) * 60 * 1000 + 20 * 60 * 1000);

    return () => clearInterval(winnerInterval);
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

    const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBgoOEhYaHiImKi4yNjo+QkZKTlJWWl5iZmpucnZ6foKGio6SlpqeoqaqrrK2ur7CxsrO0tba3uLm6u7y9vr/AwcLDxMXGx8jJysvMzc7P0NHS09TV1tfY2drb3N3e3+Dh4uPk5ebn6Onq6+zt7u/w8fLz9PX29/j5+vv8/f7/AAECAwQFBgcICQoLDA0ODxAREhMUFRYXGBkaGxwdHh8gISIjJCUmJygpKissLS4vMDEyMzQ1Njc4OTo7PD0+P0BBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWltcXV5fYGFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6e3x9fn+AgYKDhIWGh4iJiouMjY6PkJGSk5SVlpeYmZqbnJ2en6ChoqOkpaanqKmqq6ytrq+wsbKztLW2t7i5uru8vb6/wMHCw8TFxsfIycrLzM3Oz9DR0tPU1dbX2Nna29zd3t/g4eLj5OXm5+jp6uvs7e7v8PHy8/T19vf4+fr7/P3+/w==');
    audio.play().catch(() => {});

    const winningIndex = selectWinningPrize();
    const itemWidth = 170;
    const totalItems = prizes.length * 4;
    const fullCycles = 20;
    const extraOffset = Math.random() * 50 - 25;
    const targetPosition = fullCycles * prizes.length * itemWidth + winningIndex * itemWidth + itemWidth / 2 + extraOffset;
    
    setRotation(targetPosition);

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
    }, 15000);
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

                <div className="overflow-hidden rounded-2xl bg-gradient-to-b from-gray-50 to-gray-200 p-6 shadow-inner">
                  <div 
                    className="flex transition-transform"
                    style={{ 
                      transform: `translateX(-${rotation}px)`,
                      transitionDuration: isSpinning ? '15000ms' : '0ms',
                      transitionTimingFunction: isSpinning ? 'cubic-bezier(0.25, 0.1, 0.25, 1)' : 'ease',
                    }}
                  >
                    {Array(80).fill(prizes).flat().map((prize, index) => (
                      <div
                        key={index}
                        className={`${prize.color} text-white p-4 rounded-xl mx-2 flex-shrink-0 w-[150px] h-[150px] flex flex-col items-center justify-center text-center shadow-xl border-2 border-white/30 transition-all hover:scale-105`}
                      >
                        <Icon name={prize.icon} size={40} className="mb-2" />
                        <span className="font-bold text-sm leading-tight">{prize.name}</span>
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

            <Card className="border-2 border-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="Trophy" className="text-yellow-600" />
                  Недавние победители
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentWinners.map((winner) => (
                    <div
                      key={winner.id}
                      className="bg-white border border-yellow-200 rounded-lg p-3 animate-fade-in"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <Icon name="User" size={16} className="text-yellow-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-gray-900 text-sm">{winner.name}</p>
                          <p className="text-xs text-gray-600 truncate">{winner.prize}</p>
                          <p className="text-xs text-gray-400 mt-1">{winner.timeAgo}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
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