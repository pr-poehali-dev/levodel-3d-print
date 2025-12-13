import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [activeSection, setActiveSection] = useState('home');
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    description: '',
  });
  const [calcData, setCalcData] = useState({
    length: '',
    width: '',
    height: '',
    material: 'pla',
  });
  const [calcResult, setCalcResult] = useState<number | null>(null);

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('https://functions.poehali.dev/be3cc4a5-368a-4dc0-b39f-798608f8b778', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: '✅ Заказ отправлен!',
          description: data.message || 'Ожидайте ответа от менеджера.',
        });
        setFormData({ name: '', email: '', phone: '', description: '' });
      } else {
        toast({
          title: '❌ Ошибка отправки',
          description: data.error || 'Попробуйте еще раз позже',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: '❌ Ошибка',
        description: 'Не удалось отправить заявку. Проверьте интернет-соединение.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
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

  return (
    <div className="min-h-screen bg-background">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icon name="Box" size={32} className="text-primary" />
              <span className="text-2xl font-bold">Levodel Studio</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <button
                onClick={() => scrollToSection('home')}
                className={`transition-colors ${
                  activeSection === 'home' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Главная
              </button>
              <button
                onClick={() => scrollToSection('about')}
                className={`transition-colors ${
                  activeSection === 'about' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                О нас
              </button>
              <button
                onClick={() => scrollToSection('services')}
                className={`transition-colors ${
                  activeSection === 'services' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Услуги
              </button>
              <button
                onClick={() => scrollToSection('calculator')}
                className={`transition-colors ${
                  activeSection === 'calculator' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Калькулятор
              </button>
              <button
                onClick={() => scrollToSection('order')}
                className={`transition-colors ${
                  activeSection === 'order' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Заказ
              </button>
              <button
                onClick={() => scrollToSection('contacts')}
                className={`transition-colors ${
                  activeSection === 'contacts' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Контакты
              </button>
            </div>
            <Button asChild className="hidden md:flex">
              <a href="https://t.me/levodel_maksim" target="_blank" rel="noopener noreferrer">
                <Icon name="Send" size={20} className="mr-2" />
                Связаться
              </a>
            </Button>
          </div>
        </div>
      </nav>

      <section
        id="home"
        className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent" />
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 animate-fade-in">
              <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                3D печать
                <br />
                <span className="text-primary">нового уровня</span>
              </h1>
              <p className="text-xl text-muted-foreground">
                Levodel Studio — молодая команда профессионалов, превращающая идеи в реальность с помощью
                передовых технологий 3D печати
              </p>
              <div className="bg-card/50 backdrop-blur-sm border border-primary/30 rounded-lg p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon name="Paintbrush" size={24} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Фигурки под раскраску</h3>
                    <p className="text-muted-foreground mb-3">
                      Печатаем белые фигурки на заказ, которые можно раскрасить самостоятельно!
                    </p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <div className="px-3 py-1 bg-white text-black rounded-full text-sm font-medium">Белый</div>
                      <div className="px-3 py-1 bg-black text-white rounded-full text-sm font-medium">Чёрный</div>
                      <div className="px-3 py-1 bg-red-600 text-white rounded-full text-sm font-medium">Красный</div>
                      <div className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm font-medium">Синий</div>
                      <div className="px-3 py-1 bg-yellow-400 text-black rounded-full text-sm font-medium">Жёлтый</div>
                      <div className="px-3 py-1 bg-green-600 text-white rounded-full text-sm font-medium">Зелёный</div>
                    </div>
                    <p className="text-sm text-primary font-medium">
                      ✨ В комплекте: 6 красок + 2 кисточки
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" onClick={() => scrollToSection('order')} className="text-lg">
                  Сделать заказ
                  <Icon name="ArrowRight" size={20} className="ml-2" />
                </Button>
                <Button size="lg" variant="outline" onClick={() => scrollToSection('services')}>
                  Наши услуги
                </Button>
              </div>
              <div className="flex items-center gap-8 pt-4">
                <div>
                  <div className="text-3xl font-bold text-primary">24/7</div>
                  <div className="text-sm text-muted-foreground">Без выходных</div>
                </div>
                <div className="h-12 w-px bg-border" />
                <div>
                  <div className="text-3xl font-bold text-primary">100%</div>
                  <div className="text-sm text-muted-foreground">Качество</div>
                </div>
              </div>
            </div>
            <div className="relative animate-fade-in">
              <img
                src="https://cdn.poehali.dev/projects/59cd723c-a831-4db6-bb34-49d3abf24c65/files/65bcbc3e-2de8-472a-a149-926317583526.jpg"
                alt="3D печать"
                className="rounded-lg shadow-2xl border border-primary/20"
              />
              <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-primary/20 rounded-lg blur-2xl -z-10" />
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="py-24 relative">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16 animate-fade-in">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">О нас</h2>
              <p className="text-xl text-muted-foreground">
                Молодая команда с амбициозными целями
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <Card className="bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-all hover-scale">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
                    <Icon name="Target" size={24} className="text-primary" />
                  </div>
                  <CardTitle>Наша миссия</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Делать технологии 3D печати доступными каждому, помогая воплощать самые смелые идеи в
                    жизнь с максимальной точностью и скоростью
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-all hover-scale">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
                    <Icon name="Lightbulb" size={24} className="text-primary" />
                  </div>
                  <CardTitle>Наш подход</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Индивидуальный подход к каждому проекту, использование современного оборудования и
                    материалов высочайшего качества
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="mt-12 relative rounded-lg overflow-hidden">
              <img
                src="https://cdn.poehali.dev/projects/59cd723c-a831-4db6-bb34-49d3abf24c65/files/3540b4a0-33fe-494d-9baf-327c037837ff.jpg"
                alt="Наши работы"
                className="w-full h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Наши услуги</h2>
            <p className="text-xl text-muted-foreground">
              Полный спектр услуг по 3D печати
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {services.map((service, index) => (
              <Card
                key={index}
                className="bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-all hover-scale group"
              >
                <CardHeader>
                  <div className="w-16 h-16 bg-primary/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/30 transition-colors">
                    <Icon name={service.icon as any} size={32} className="text-primary" />
                  </div>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-16 text-center">
            <img
              src="https://cdn.poehali.dev/projects/59cd723c-a831-4db6-bb34-49d3abf24c65/files/145c82c5-75ea-4d4c-a677-0a0acc833bdb.jpg"
              alt="Процесс печати"
              className="rounded-lg shadow-2xl border border-primary/20 max-w-4xl mx-auto"
            />
          </div>
        </div>
      </section>

      <section id="calculator" className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12 animate-fade-in">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">Калькулятор стоимости</h2>
              <p className="text-xl text-muted-foreground">
                Рассчитайте примерную стоимость вашего заказа
              </p>
            </div>

            <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
              <CardContent className="pt-6">
                <div className="space-y-6">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="length">Длина (мм)</Label>
                      <Input
                        id="length"
                        type="number"
                        placeholder="100"
                        value={calcData.length}
                        onChange={(e) => setCalcData({ ...calcData, length: e.target.value })}
                        className="bg-background/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="width">Ширина (мм)</Label>
                      <Input
                        id="width"
                        type="number"
                        placeholder="100"
                        value={calcData.width}
                        onChange={(e) => setCalcData({ ...calcData, width: e.target.value })}
                        className="bg-background/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="height">Высота (мм)</Label>
                      <Input
                        id="height"
                        type="number"
                        placeholder="100"
                        value={calcData.height}
                        onChange={(e) => setCalcData({ ...calcData, height: e.target.value })}
                        className="bg-background/50"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="material">Материал</Label>
                    <select
                      id="material"
                      value={calcData.material}
                      onChange={(e) => setCalcData({ ...calcData, material: e.target.value })}
                      className="w-full h-10 px-3 rounded-md bg-background/50 border border-input text-foreground"
                    >
                      <option value="pla">PLA (стандартный пластик)</option>
                      <option value="abs">ABS (прочный пластик)</option>
                      <option value="petg">PETG (гибкий и прочный)</option>
                      <option value="tpu">TPU (эластичный)</option>
                    </select>
                  </div>

                  <Button onClick={calculatePrice} size="lg" className="w-full">
                    <Icon name="Calculator" size={20} className="mr-2" />
                    Рассчитать стоимость
                  </Button>

                  {calcResult !== null && (
                    <div className="bg-primary/10 border border-primary/30 rounded-lg p-6 animate-fade-in">
                      <div className="text-center">
                        <div className="text-sm text-muted-foreground mb-2">Стоимость с доставкой</div>
                        <div className="text-4xl font-bold text-primary mb-2">{calcResult} ₽</div>
                        <div className="text-sm text-muted-foreground">
                          В стоимость включена доставка по городу
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="text-xs text-muted-foreground text-center">
                    * Расчёт приблизительный. Точную стоимость уточняйте у менеджера
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section id="order" className="py-24 relative">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12 animate-fade-in">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">Сделать заказ</h2>
              <p className="text-xl text-muted-foreground">
                Заполните форму, и мы свяжемся с вами в ближайшее время
              </p>
            </div>

            <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
              <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Ваше имя</Label>
                    <Input
                      id="name"
                      placeholder="Иван Иванов"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="bg-background/50"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="ivan@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="bg-background/50"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Телефон</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+7 (999) 123-45-67"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                      className="bg-background/50"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Описание заказа</Label>
                    <Textarea
                      id="description"
                      placeholder="Опишите, что вы хотите напечатать..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      required
                      rows={6}
                      className="bg-background/50"
                    />
                  </div>

                  <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Icon name="Loader2" size={20} className="mr-2 animate-spin" />
                        Отправка...
                      </>
                    ) : (
                      <>
                        Отправить заявку
                        <Icon name="Send" size={20} className="ml-2" />
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section id="contacts" className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-t from-primary/10 via-transparent to-transparent" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12 animate-fade-in">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">Контакты</h2>
              <p className="text-xl text-muted-foreground">
                Мы всегда на связи
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
                <CardHeader>
                  <CardTitle>Levodel Studio</CardTitle>
                  <CardDescription>Профессиональная 3D печать</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Icon name="Clock" size={20} className="text-primary mt-1" />
                    <div>
                      <div className="font-medium">Режим работы</div>
                      <div className="text-sm text-muted-foreground">Круглосуточно, без выходных</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Icon name="MessageCircle" size={20} className="text-primary mt-1" />
                    <div>
                      <div className="font-medium">Telegram</div>
                      <a
                        href="https://t.me/levodel_maksim"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline"
                      >
                        @levodel_maksim
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-primary/20 to-accent/20 border-primary/40">
                <CardHeader>
                  <CardTitle>Связаться с нами</CardTitle>
                  <CardDescription className="text-foreground/80">
                    Напишите администратору напрямую
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild size="lg" className="w-full">
                    <a href="https://t.me/levodel_maksim" target="_blank" rel="noopener noreferrer">
                      <Icon name="Send" size={20} className="mr-2" />
                      Написать в Telegram
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-border py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Icon name="Box" size={24} className="text-primary" />
              <span className="font-bold">Levodel Studio</span>
            </div>
            <div className="text-sm text-muted-foreground">
              © 2024 Levodel Studio. Все права защищены.
            </div>
            <Button variant="ghost" size="sm" asChild>
              <a href="https://t.me/levodel_maksim" target="_blank" rel="noopener noreferrer">
                <Icon name="Send" size={16} className="mr-2" />
                Telegram
              </a>
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;