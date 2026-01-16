import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { toast } = useToast();
  
  const [calcData, setCalcData] = useState({
    length: '',
    width: '',
    height: '',
    material: 'pla',
  });
  const [calcResult, setCalcResult] = useState<number | null>(null);

  const [orderForm, setOrderForm] = useState({
    name: '',
    phone: '',
    email: '',
    length: '',
    width: '',
    height: '',
    material: 'pla',
    quantity: '1',
    description: '',
    fileLink: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    setMobileMenuOpen(false);
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  const calculatePrice = () => {
    const l = parseFloat(calcData.length) || 0;
    const w = parseFloat(calcData.width) || 0;
    const h = parseFloat(calcData.height) || 0;

    if (l <= 0 || w <= 0 || h <= 0) {
      toast({
        title: '⚠️ Ошибка',
        description: 'Введите корректные размеры',
        variant: 'destructive',
      });
      return;
    }

    const volumeCm3 = l * w * h;
    const volumeMl = volumeCm3;

    const materialPrices: { [key: string]: number } = {
      pla: 0.03,
      abs: 0.035,
      petg: 0.04,
      tpu: 0.05,
    };

    const baseCost = volumeMl * materialPrices[calcData.material];
    const markup = baseCost * 1.5;
    const delivery = 300;
    const total = Math.ceil(markup + delivery);

    setCalcResult(total);
  };

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!orderForm.name || !orderForm.phone) {
      toast({
        title: '⚠️ Ошибка',
        description: 'Заполните обязательные поля: имя и телефон',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('https://functions.poehali.dev/be3cc4a5-368a-4dc0-b39f-798608f8b778', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderForm),
      });

      if (response.ok) {
        toast({
          title: '✅ Заказ отправлен!',
          description: 'Мы свяжемся с вами в ближайшее время',
        });
        setOrderForm({
          name: '',
          phone: '',
          email: '',
          length: '',
          width: '',
          height: '',
          material: 'pla',
          quantity: '1',
          description: '',
          fileLink: '',
        });
      } else {
        throw new Error('Ошибка отправки');
      }
    } catch (error) {
      toast({
        title: '❌ Ошибка',
        description: 'Не удалось отправить заказ. Попробуйте позже или свяжитесь через Telegram',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const services = [
    {
      icon: 'Box',
      title: 'Прототипирование',
      description: 'Быстрое создание прототипов для тестирования идей и концепций',
    },
    {
      icon: 'Cog',
      title: 'Функциональные детали',
      description: 'Производство деталей для промышленного использования',
    },
    {
      icon: 'Palette',
      title: 'Дизайнерские изделия',
      description: 'Уникальные декоративные элементы и сувенирная продукция',
    },
    {
      icon: 'Zap',
      title: 'Срочная печать',
      description: 'Работаем 24/7 без выходных для выполнения срочных заказов',
    },
    {
      icon: 'Paintbrush',
      title: 'Фигурки под раскраску',
      description: 'Белые фигурки + набор красок (6 цветов) и 2 кисточки в комплекте',
    },
  ];

  const faqItems = [
    {
      question: 'Какие материалы вы используете?',
      answer: 'Мы работаем с PLA (экологичный, идеален для декора), ABS (прочный, термостойкий), PETG (гибкий, влагостойкий) и TPU (эластичный, износостойкий).',
    },
    {
      question: 'Сколько времени занимает печать?',
      answer: 'Стандартный срок — 3-5 дней. Срочные заказы выполняем за 24-48 часов (доплата +30%).',
    },
    {
      question: 'У вас есть 3D сканер?',
      answer: 'Да! Используем CR-Scan Raptor с точностью 0,02 мм. Можем отсканировать ваш объект и создать цифровую 3D модель.',
    },
    {
      question: 'Планируется ли фотополимерный принтер?',
      answer: 'Да, скоро! Фотополимерная печать даст гладкую поверхность и детализацию до 25 микрон — идеально для ювелирки и миниатюр.',
    },
    {
      question: 'Что такое фигурки под раскраску?',
      answer: 'Печатаем белые фигурки на заказ. В комплекте: 6 акриловых красок (черный, белый, красный, синий, желтый, зеленый) + 2 кисточки.',
    },
    {
      question: 'Как рассчитывается стоимость?',
      answer: 'Цена зависит от объёма модели, выбранного материала и сложности. Используйте наш калькулятор для предварительной оценки!',
    },
    {
      question: 'Можно ли напечатать по своей 3D модели?',
      answer: 'Конечно! Присылайте файлы в форматах STL, OBJ, 3MF. Мы проверим модель и сообщим стоимость.',
    },
    {
      question: 'Как происходит доставка?',
      answer: 'Доставка по России — Почта России или СДЭК. Стоимость рассчитывается индивидуально. Самовывоз — бесплатно.',
    },
    {
      question: 'Даёте ли гарантию на изделия?',
      answer: 'Да! Гарантируем качество печати. Если обнаружится брак — бесплатно перепечатаем или вернём деньги.',
    },
    {
      question: 'Можно ли заказать печать в больших объёмах?',
      answer: 'Да, работаем с мелкосерийным и серийным производством. Для оптовых заказов — скидки до 20%.',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 py-3 md:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icon name="Box" size={28} className="text-primary md:w-8 md:h-8" />
              <span className="text-xl md:text-2xl font-bold">Levodel Studio</span>
            </div>
            
            <div className="hidden lg:flex items-center gap-6">
              <button onClick={() => scrollToSection('home')} className={`transition-colors text-sm ${activeSection === 'home' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
                Главная
              </button>
              <button onClick={() => scrollToSection('about')} className={`transition-colors text-sm ${activeSection === 'about' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
                О нас
              </button>
              <button onClick={() => scrollToSection('services')} className={`transition-colors text-sm ${activeSection === 'services' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
                Услуги
              </button>
              <button onClick={() => scrollToSection('calculator')} className={`transition-colors text-sm ${activeSection === 'calculator' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
                Калькулятор
              </button>
              <button onClick={() => scrollToSection('order')} className={`transition-colors text-sm ${activeSection === 'order' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
                Заказать
              </button>
              <button onClick={() => scrollToSection('faq')} className={`transition-colors text-sm ${activeSection === 'faq' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
                FAQ
              </button>
              <a href="https://t.me/levo_del3d" target="_blank" rel="noopener noreferrer" className="transition-colors text-sm text-muted-foreground hover:text-foreground">
                Отзывы
              </a>
              <button onClick={() => scrollToSection('contacts')} className={`transition-colors text-sm ${activeSection === 'contacts' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
                Контакты
              </button>
            </div>

            <Button asChild className="hidden md:flex">
              <a href="https://t.me/levodel_maksim" target="_blank" rel="noopener noreferrer">
                <Icon name="Send" size={18} className="mr-2" />
                Связаться
              </a>
            </Button>

            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden">
              <Icon name={mobileMenuOpen ? "X" : "Menu"} size={24} />
            </button>
          </div>

          {mobileMenuOpen && (
            <div className="lg:hidden mt-4 pb-4 space-y-3 border-t border-border pt-4">
              <button onClick={() => scrollToSection('home')} className="block w-full text-left py-2 text-muted-foreground hover:text-foreground">
                Главная
              </button>
              <button onClick={() => scrollToSection('about')} className="block w-full text-left py-2 text-muted-foreground hover:text-foreground">
                О нас
              </button>
              <button onClick={() => scrollToSection('services')} className="block w-full text-left py-2 text-muted-foreground hover:text-foreground">
                Услуги
              </button>
              <button onClick={() => scrollToSection('calculator')} className="block w-full text-left py-2 text-muted-foreground hover:text-foreground">
                Калькулятор
              </button>
              <button onClick={() => scrollToSection('order')} className="block w-full text-left py-2 text-muted-foreground hover:text-foreground">
                Заказать
              </button>
              <button onClick={() => scrollToSection('faq')} className="block w-full text-left py-2 text-muted-foreground hover:text-foreground">
                FAQ
              </button>
              <a href="https://t.me/levo_del3d" target="_blank" rel="noopener noreferrer" className="block w-full text-left py-2 text-muted-foreground hover:text-foreground">
                Отзывы
              </a>
              <button onClick={() => scrollToSection('contacts')} className="block w-full text-left py-2 text-muted-foreground hover:text-foreground">
                Контакты
              </button>
              <Button asChild className="w-full mt-2">
                <a href="https://t.me/levodel_maksim" target="_blank" rel="noopener noreferrer">
                  <Icon name="Send" size={18} className="mr-2" />
                  Связаться
                </a>
              </Button>
            </div>
          )}
        </div>
      </nav>

      <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20 px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent" />
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 md:w-96 md:h-96 bg-primary rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 md:w-96 md:h-96 bg-accent rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto relative z-10">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="space-y-4 md:space-y-6 animate-fade-in text-center md:text-left">
              <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold leading-tight">
                3D печать
                <br />
                <span className="text-primary">нового уровня</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground">
                Levodel Studio — молодая команда профессионалов, превращающая идеи в реальность с помощью передовых технологий 3D печати
              </p>
              <div className="bg-card/50 backdrop-blur-sm border border-primary/30 rounded-lg p-4 md:p-6">
                <div className="flex flex-col sm:flex-row items-start gap-4">
                  <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0 mx-auto sm:mx-0">
                    <Icon name="Paintbrush" size={24} className="text-primary" />
                  </div>
                  <div className="text-center sm:text-left">
                    <h3 className="text-xl font-bold mb-2">Фигурки под раскраску</h3>
                    <p className="text-muted-foreground mb-3">
                      Печатаем белые фигурки на заказ, которые можно раскрасить самостоятельно!
                    </p>
                    <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                      <div className="px-2 py-1 bg-white text-black rounded-full text-xs font-medium">Белый</div>
                      <div className="px-2 py-1 bg-black text-white rounded-full text-xs font-medium">Чёрный</div>
                      <div className="px-2 py-1 bg-red-600 text-white rounded-full text-xs font-medium">Красный</div>
                      <div className="px-2 py-1 bg-blue-600 text-white rounded-full text-xs font-medium">Синий</div>
                      <div className="px-2 py-1 bg-yellow-400 text-black rounded-full text-xs font-medium">Жёлтый</div>
                      <div className="px-2 py-1 bg-green-600 text-white rounded-full text-xs font-medium">Зелёный</div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-3">
                      + 2 кисточки в комплекте!
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Button size="lg" onClick={() => scrollToSection('order')} className="w-full sm:w-auto">
                  <Icon name="ShoppingCart" size={20} className="mr-2" />
                  Оформить заказ
                </Button>
                <Button size="lg" variant="outline" onClick={() => scrollToSection('calculator')} className="w-full sm:w-auto">
                  <Icon name="Calculator" size={20} className="mr-2" />
                  Рассчитать стоимость
                </Button>
              </div>
            </div>
            <div className="hidden md:flex items-center justify-center animate-fade-in">
              <div className="relative w-full max-w-md aspect-square">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl rotate-6" />
                <div className="absolute inset-0 bg-gradient-to-tl from-primary/20 to-accent/20 rounded-3xl -rotate-6" />
                <div className="relative flex items-center justify-center h-full">
                  <Icon name="Box" size={200} className="text-primary/30" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="py-16 md:py-24 px-4 bg-muted/50">
        <div className="container mx-auto">
          <div className="text-center mb-12 md:mb-16 animate-fade-in">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">О нас</h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              Levodel Studio — это молодая команда энтузиастов, объединённых страстью к 3D технологиям
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            <Card className="hover-card text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name="Zap" size={32} className="text-primary" />
                </div>
                <CardTitle>Скорость</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Работаем 24/7 без выходных. Срочные заказы выполняем за 24-48 часов
                </p>
              </CardContent>
            </Card>

            <Card className="hover-card text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name="Award" size={32} className="text-primary" />
                </div>
                <CardTitle>Качество</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Используем профессиональное оборудование и материалы от ведущих производителей
                </p>
              </CardContent>
            </Card>

            <Card className="hover-card text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name="Users" size={32} className="text-primary" />
                </div>
                <CardTitle>Поддержка</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Консультируем на всех этапах — от идеи до готового изделия
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section id="services" className="py-16 md:py-24 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12 md:mb-16 animate-fade-in">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Наши услуги</h2>
            <p className="text-lg md:text-xl text-muted-foreground">
              Полный спектр услуг 3D печати для любых задач
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {services.map((service, index) => (
              <Card key={index} className="hover-card">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
                    <Icon name={service.icon as any} size={24} className="text-primary" />
                  </div>
                  <CardTitle className="text-lg md:text-xl">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm md:text-base">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="calculator" className="py-16 md:py-24 px-4 bg-muted/50">
        <div className="container mx-auto max-w-2xl">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Калькулятор стоимости</h2>
            <p className="text-lg md:text-xl text-muted-foreground">
              Узнайте примерную стоимость печати вашего изделия
            </p>
          </div>

          <Card className="hover-card">
            <CardHeader>
              <CardTitle>Расчёт стоимости</CardTitle>
              <CardDescription>Введите размеры изделия в сантиметрах</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 md:space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="calc-length">Длина (см)</Label>
                  <Input
                    id="calc-length"
                    type="number"
                    placeholder="10"
                    value={calcData.length}
                    onChange={(e) => setCalcData({ ...calcData, length: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="calc-width">Ширина (см)</Label>
                  <Input
                    id="calc-width"
                    type="number"
                    placeholder="10"
                    value={calcData.width}
                    onChange={(e) => setCalcData({ ...calcData, width: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="calc-height">Высота (см)</Label>
                  <Input
                    id="calc-height"
                    type="number"
                    placeholder="10"
                    value={calcData.height}
                    onChange={(e) => setCalcData({ ...calcData, height: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="calc-material">Материал</Label>
                <select
                  id="calc-material"
                  value={calcData.material}
                  onChange={(e) => setCalcData({ ...calcData, material: e.target.value })}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background"
                >
                  <option value="pla">PLA (0.03₽/мл) — Экологичный, идеален для декора</option>
                  <option value="abs">ABS (0.035₽/мл) — Прочный, термостойкий</option>
                  <option value="petg">PETG (0.04₽/мл) — Гибкий, влагостойкий</option>
                  <option value="tpu">TPU (0.05₽/мл) — Эластичный, износостойкий</option>
                </select>
              </div>

              <Button onClick={calculatePrice} className="w-full" size="lg">
                <Icon name="Calculator" size={20} className="mr-2" />
                Рассчитать стоимость
              </Button>

              {calcResult !== null && (
                <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 md:p-6 text-center animate-fade-in">
                  <p className="text-sm text-muted-foreground mb-2">Примерная стоимость:</p>
                  <p className="text-3xl md:text-4xl font-bold text-primary">{calcResult}₽</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    *Включая доставку. Точная цена зависит от сложности модели
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      <section id="order" className="py-16 md:py-24 px-4">
        <div className="container mx-auto max-w-3xl">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Оформить заказ</h2>
            <p className="text-lg md:text-xl text-muted-foreground">
              Заполните форму и мы свяжемся с вами в ближайшее время
            </p>
          </div>

          <Card className="hover-card">
            <CardHeader>
              <CardTitle>Форма заказа</CardTitle>
              <CardDescription>Все поля с * обязательны для заполнения</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleOrderSubmit} className="space-y-4 md:space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="order-name">Ваше имя *</Label>
                    <Input
                      id="order-name"
                      type="text"
                      placeholder="Иван"
                      required
                      value={orderForm.name}
                      onChange={(e) => setOrderForm({ ...orderForm, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="order-phone">Телефон *</Label>
                    <Input
                      id="order-phone"
                      type="tel"
                      placeholder="+7 900 123-45-67"
                      required
                      value={orderForm.phone}
                      onChange={(e) => setOrderForm({ ...orderForm, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="order-email">Email (необязательно)</Label>
                  <Input
                    id="order-email"
                    type="email"
                    placeholder="ivan@example.com"
                    value={orderForm.email}
                    onChange={(e) => setOrderForm({ ...orderForm, email: e.target.value })}
                  />
                </div>

                <div className="border-t border-border pt-4 md:pt-6">
                  <h3 className="font-semibold mb-4">Параметры изделия</h3>
                  
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div>
                      <Label htmlFor="order-length">Длина (см)</Label>
                      <Input
                        id="order-length"
                        type="number"
                        placeholder="10"
                        value={orderForm.length}
                        onChange={(e) => setOrderForm({ ...orderForm, length: e.target.value })}
                      />
                      <p className="text-xs text-muted-foreground mt-1">Примерно</p>
                    </div>
                    <div>
                      <Label htmlFor="order-width">Ширина (см)</Label>
                      <Input
                        id="order-width"
                        type="number"
                        placeholder="10"
                        value={orderForm.width}
                        onChange={(e) => setOrderForm({ ...orderForm, width: e.target.value })}
                      />
                      <p className="text-xs text-muted-foreground mt-1">Примерно</p>
                    </div>
                    <div>
                      <Label htmlFor="order-height">Высота (см)</Label>
                      <Input
                        id="order-height"
                        type="number"
                        placeholder="10"
                        value={orderForm.height}
                        onChange={(e) => setOrderForm({ ...orderForm, height: e.target.value })}
                      />
                      <p className="text-xs text-muted-foreground mt-1">Примерно</p>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <Label htmlFor="order-material">Материал</Label>
                      <select
                        id="order-material"
                        value={orderForm.material}
                        onChange={(e) => setOrderForm({ ...orderForm, material: e.target.value })}
                        className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                      >
                        <option value="pla">PLA — Экологичный</option>
                        <option value="abs">ABS — Прочный</option>
                        <option value="petg">PETG — Гибкий</option>
                        <option value="tpu">TPU — Эластичный</option>
                      </select>
                      <p className="text-xs text-muted-foreground mt-1">Подходящий для вашей задачи</p>
                    </div>
                    <div>
                      <Label htmlFor="order-quantity">Количество (шт)</Label>
                      <Input
                        id="order-quantity"
                        type="number"
                        min="1"
                        placeholder="1"
                        value={orderForm.quantity}
                        onChange={(e) => setOrderForm({ ...orderForm, quantity: e.target.value })}
                      />
                      <p className="text-xs text-muted-foreground mt-1">От 10 шт — скидка!</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <Label htmlFor="order-filelink">Ссылка на 3D модель</Label>
                    <Input
                      id="order-filelink"
                      type="url"
                      placeholder="https://drive.google.com/..."
                      value={orderForm.fileLink}
                      onChange={(e) => setOrderForm({ ...orderForm, fileLink: e.target.value })}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Google Drive, Яндекс.Диск или любая ссылка на STL/OBJ файл
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="order-description">Описание заказа</Label>
                    <Textarea
                      id="order-description"
                      placeholder="Опишите, что вы хотите напечатать: назначение, цвет, особые требования..."
                      rows={4}
                      value={orderForm.description}
                      onChange={(e) => setOrderForm({ ...orderForm, description: e.target.value })}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Чем подробнее описание, тем точнее мы выполним заказ
                    </p>
                  </div>
                </div>

                <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Icon name="Loader2" size={20} className="mr-2 animate-spin" />
                      Отправка...
                    </>
                  ) : (
                    <>
                      <Icon name="Send" size={20} className="mr-2" />
                      Отправить заказ
                    </>
                  )}
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  Нажимая кнопку, вы соглашаетесь на обработку персональных данных
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      <section id="faq" className="py-16 md:py-24 px-4 bg-muted/50">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12 md:mb-16 animate-fade-in">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Часто задаваемые вопросы</h2>
            <p className="text-lg md:text-xl text-muted-foreground">
              Ответы на популярные вопросы о 3D печати
            </p>
          </div>

          <div className="space-y-4">
            {faqItems.map((item, index) => (
              <Card key={index} className="hover-card">
                <CardHeader>
                  <CardTitle className="text-lg md:text-xl flex items-start gap-3">
                    <Icon name="HelpCircle" size={24} className="text-primary flex-shrink-0 mt-1" />
                    <span>{item.question}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm md:text-base pl-9">{item.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="contacts" className="py-16 md:py-24 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Контакты</h2>
            <p className="text-lg md:text-xl text-muted-foreground">
              Свяжитесь с нами удобным способом
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 md:gap-8">
            <Card className="hover-card text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name="Send" size={32} className="text-primary" />
                </div>
                <CardTitle>Telegram</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">Быстрый ответ в мессенджере</p>
                <Button asChild className="w-full">
                  <a href="https://t.me/levodel_maksim" target="_blank" rel="noopener noreferrer">
                    Написать в Telegram
                  </a>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover-card text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name="MessageCircle" size={32} className="text-primary" />
                </div>
                <CardTitle>Отзывы</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">Читайте отзывы наших клиентов</p>
                <Button asChild variant="outline" className="w-full">
                  <a href="https://t.me/levo_del3d" target="_blank" rel="noopener noreferrer">
                    Перейти к отзывам
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <footer className="border-t border-border py-8 md:py-12 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Icon name="Box" size={24} className="text-primary" />
              <span className="text-lg font-bold">Levodel Studio</span>
            </div>
            <p className="text-sm text-muted-foreground text-center md:text-left">
              © 2024 Levodel Studio. Все права защищены.
            </p>
            <div className="flex gap-4">
              <Button asChild variant="ghost" size="icon">
                <a href="https://t.me/levodel_maksim" target="_blank" rel="noopener noreferrer">
                  <Icon name="Send" size={20} />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;