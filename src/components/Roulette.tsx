import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface Prize {
  id: number;
  name: string;
  icon: string;
  chance: number;
  color: string;
}

const prizes: Prize[] = [
  { id: 1, name: 'Премиум Telegram на 1 год', icon: 'Award', chance: 0, color: 'bg-purple-500' },
  { id: 2, name: 'Скидка 30% на услуги', icon: 'Tag', chance: 60, color: 'bg-green-500' },
  { id: 3, name: 'iPhone 17 Pro Max 256GB', icon: 'Smartphone', chance: 0, color: 'bg-blue-500' },
  { id: 4, name: '5000₽ на счёт', icon: 'Banknote', chance: 0, color: 'bg-yellow-500' },
  { id: 5, name: '3D принтер Bambu Lab A1', icon: 'Box', chance: 0, color: 'bg-red-500' },
  { id: 6, name: 'Скидка 30% на игрушки', icon: 'Gamepad2', chance: 40, color: 'bg-orange-500' },
  { id: 7, name: '1000₽ на счёт', icon: 'Coins', chance: 0, color: 'bg-pink-500' },
];

const SPIN_COST = 3;
const DAILY_BONUS = 10;
const TELEGRAM_BONUS = 50;

export default function Roulette() {
  const [balance, setBalance] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentPrizeIndex, setCurrentPrizeIndex] = useState(0);
  const [lastDailyLogin, setLastDailyLogin] = useState<string | null>(null);
  const [telegramSubscribed, setTelegramSubscribed] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const savedBalance = localStorage.getItem('plasticBalance');
    const savedLastLogin = localStorage.getItem('lastDailyLogin');
    const savedTgSub = localStorage.getItem('telegramSubscribed');
    
    if (savedBalance) setBalance(parseInt(savedBalance));
    if (savedLastLogin) setLastDailyLogin(savedLastLogin);
    if (savedTgSub) setTelegramSubscribed(savedTgSub === 'true');
    
    // Проверяем ежедневный бонус
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
    
    return 1; // По умолчанию скидка 30%
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
    const spins = 30 + winningIndex;
    let currentSpin = 0;

    const interval = setInterval(() => {
      setCurrentPrizeIndex((prev) => (prev + 1) % prizes.length);
      currentSpin++;

      if (currentSpin >= spins) {
        clearInterval(interval);
        setCurrentPrizeIndex(winningIndex);
        setIsSpinning(false);

        setTimeout(() => {
          toast({
            title: '🎊 Поздравляем!',
            description: `Вы выиграли: ${prizes[winningIndex].name}`,
          });
        }, 500);
      }
    }, 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 bg-white px-6 py-3 rounded-full shadow-lg mb-6">
            <Icon name="Sparkles" size={24} className="text-yellow-500" />
            <span className="text-2xl font-bold text-gray-800">{balance} Пластика</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Колесо Фортуны
          </h1>
          <p className="text-lg text-gray-600">
            Крутите рулетку и выигрывайте призы! 1 прокрутка = {SPIN_COST} Пластика
          </p>
        </div>

        <Card className="mb-8 overflow-hidden border-4 border-purple-200">
          <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
            <CardTitle className="text-center text-2xl">🎰 Призовое колесо</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="relative">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                <div className="w-0 h-0 border-l-[20px] border-r-[20px] border-t-[30px] border-l-transparent border-r-transparent border-t-red-500 drop-shadow-lg"></div>
              </div>

              <div className="grid grid-cols-1 gap-2 py-8">
                {prizes.map((prize, index) => (
                  <div
                    key={prize.id}
                    className={`
                      ${prize.color} text-white p-4 rounded-lg transition-all duration-100
                      ${currentPrizeIndex === index ? 'scale-105 shadow-2xl ring-4 ring-white' : 'scale-95 opacity-60'}
                    `}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Icon name={prize.icon} size={32} />
                        <span className="font-bold text-lg">{prize.name}</span>
                      </div>
                      {prize.chance > 0 && (
                        <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                          {prize.chance}% шанс
                        </span>
                      )}
                    </div>
                  </div>
                ))}
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

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-2 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="Gift" className="text-blue-500" />
                Ежедневный бонус
              </CardTitle>
              <CardDescription>
                Заходите каждый день и получайте {DAILY_BONUS} Пластика!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-600">
                {lastDailyLogin === new Date().toDateString() ? (
                  <span className="text-green-600 font-medium">✅ Бонус за сегодня получен</span>
                ) : (
                  <span className="text-orange-600 font-medium">⏰ Зайдите завтра за новым бонусом</span>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-pink-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="Send" className="text-pink-500" />
                Подписка на Telegram
              </CardTitle>
              <CardDescription>
                Подпишитесь и получите {TELEGRAM_BONUS} Пластика!
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!telegramSubscribed ? (
                <Button
                  onClick={handleTelegramSubscribe}
                  className="w-full bg-gradient-to-r from-blue-500 to-pink-500 hover:from-blue-600 hover:to-pink-600"
                >
                  <Icon name="Send" size={20} className="mr-2" />
                  Подписаться на канал
                </Button>
              ) : (
                <span className="text-green-600 font-medium flex items-center gap-2">
                  <Icon name="CheckCircle" size={20} />
                  Бонус получен!
                </span>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
