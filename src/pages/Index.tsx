import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [activeSection, setActiveSection] = useState('home');
  const { toast } = useToast();
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
                onClick={() => scrollToSection('portfolio')}
                className={`transition-colors ${
                  activeSection === 'portfolio' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Портфолио
              </button>
              <button
                onClick={() => scrollToSection('faq')}
                className={`transition-colors ${
                  activeSection === 'faq' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                FAQ
              </button>
              <a
                href="https://t.me/levo_del3d"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors text-muted-foreground hover:text-foreground"
              >
                Отзывы
              </a>
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
                <Button size="lg" asChild className="text-lg">
                  <a href="https://t.me/levodel_maksim" target="_blank" rel="noopener noreferrer">
                    <Icon name="Send" size={20} className="mr-2" />
                    Связаться с нами
                  </a>
                </Button>
                <Button size="lg" variant="outline" onClick={() => scrollToSection('calculator')}>
                  <Icon name="Calculator" size={20} className="mr-2" />
                  Рассчитать стоимость
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
                      <Label htmlFor="length">Длина (см)</Label>
                      <Input
                        id="length"
                        type="number"
                        step="0.1"
                        placeholder="10"
                        value={calcData.length}
                        onChange={(e) => setCalcData({ ...calcData, length: e.target.value })}
                        className="bg-background/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="width">Ширина (см)</Label>
                      <Input
                        id="width"
                        type="number"
                        step="0.1"
                        placeholder="10"
                        value={calcData.width}
                        onChange={(e) => setCalcData({ ...calcData, width: e.target.value })}
                        className="bg-background/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="height">Высота (см)</Label>
                      <Input
                        id="height"
                        type="number"
                        step="0.1"
                        placeholder="10"
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

      <section id="portfolio" className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Портфолио работ</h2>
            <p className="text-xl text-muted-foreground">
              Примеры наших работ в различных категориях
            </p>
          </div>

          <div className="space-y-20">
            <div>
              <h3 className="text-3xl font-bold mb-8 text-center">Игрушки</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-all hover-scale overflow-hidden">
                  <div className="aspect-square bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                    <img src="https://cdn.poehali.dev/projects/59cd723c-a831-4db6-bb34-49d3abf24c65/files/cc393254-b760-4cb9-bd5f-5d7c4b23e54f.jpg" alt="Фигурка супергероя" className="w-full h-full object-cover" />
                  </div>
                  <CardHeader>
                    <CardTitle className="text-lg">Фигурка супергероя</CardTitle>
                    <CardDescription>Детализированная фигурка высотой 15 см, материал PLA</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-primary">890 ₽</div>
                  </CardContent>
                </Card>

                <Card className="bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-all hover-scale overflow-hidden">
                  <div className="aspect-square bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                    <img src="https://cdn.poehali.dev/projects/59cd723c-a831-4db6-bb34-49d3abf24c65/files/275add4a-0403-4916-a2f9-632277710aa8.jpg" alt="Конструктор" className="w-full h-full object-cover" />
                  </div>
                  <CardHeader>
                    <CardTitle className="text-lg">Конструктор-пазл</CardTitle>
                    <CardDescription>Набор из 20 деталей для сборки модели машины</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-primary">1 250 ₽</div>
                  </CardContent>
                </Card>

                <Card className="bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-all hover-scale overflow-hidden">
                  <div className="aspect-square bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                    <img src="https://cdn.poehali.dev/projects/59cd723c-a831-4db6-bb34-49d3abf24c65/files/85c30fa1-843b-49a2-af9a-3160377d398c.jpg" alt="Динозавр" className="w-full h-full object-cover" />
                  </div>
                  <CardHeader>
                    <CardTitle className="text-lg">Фигурка динозавра</CardTitle>
                    <CardDescription>Тираннозавр с подвижными лапами, 12 см</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-primary">750 ₽</div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div>
              <h3 className="text-3xl font-bold mb-8 text-center">Товары для дома</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-all hover-scale overflow-hidden">
                  <div className="aspect-square bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                    <img src="https://cdn.poehali.dev/projects/59cd723c-a831-4db6-bb34-49d3abf24c65/files/70856854-7fea-4ef1-846b-9b138317daf9.jpg" alt="Органайзер" className="w-full h-full object-cover" />
                  </div>
                  <CardHeader>
                    <CardTitle className="text-lg">Органайзер для стола</CardTitle>
                    <CardDescription>Многофункциональный держатель для канцелярии</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-primary">650 ₽</div>
                  </CardContent>
                </Card>

                <Card className="bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-all hover-scale overflow-hidden">
                  <div className="aspect-square bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                    <img src="https://cdn.poehali.dev/projects/59cd723c-a831-4db6-bb34-49d3abf24c65/files/dfc2a139-6be8-4160-b75a-e5f7b83fde4e.jpg" alt="Вазон" className="w-full h-full object-cover" />
                  </div>
                  <CardHeader>
                    <CardTitle className="text-lg">Декоративный вазон</CardTitle>
                    <CardDescription>Современный дизайн, диаметр 10 см</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-primary">490 ₽</div>
                  </CardContent>
                </Card>

                <Card className="bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-all hover-scale overflow-hidden">
                  <div className="aspect-square bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                    <img src="https://cdn.poehali.dev/projects/59cd723c-a831-4db6-bb34-49d3abf24c65/files/f8c05db8-8684-4aa9-98f3-3395ac21e519.jpg" alt="Крючки" className="w-full h-full object-cover" />
                  </div>
                  <CardHeader>
                    <CardTitle className="text-lg">Настенные крючки</CardTitle>
                    <CardDescription>Набор из 3 штук, выдерживают до 2 кг</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-primary">380 ₽</div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div>
              <h3 className="text-3xl font-bold mb-8 text-center">Товары для автомобиля</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-all hover-scale overflow-hidden">
                  <div className="aspect-square bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                    <img src="https://cdn.poehali.dev/projects/59cd723c-a831-4db6-bb34-49d3abf24c65/files/251125c6-98ff-450d-9050-7f72dd356c06.jpg" alt="Держатель телефона" className="w-full h-full object-cover" />
                  </div>
                  <CardHeader>
                    <CardTitle className="text-lg">Держатель для телефона</CardTitle>
                    <CardDescription>Крепление на дефлектор, универсальное</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-primary">550 ₽</div>
                  </CardContent>
                </Card>

                <Card className="bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-all hover-scale overflow-hidden">
                  <div className="aspect-square bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                    <img src="https://cdn.poehali.dev/projects/59cd723c-a831-4db6-bb34-49d3abf24c65/files/c02a88ee-7af1-45e3-9077-86b6dc1e3908.jpg" alt="Органайзер в багажник" className="w-full h-full object-cover" />
                  </div>
                  <CardHeader>
                    <CardTitle className="text-lg">Органайзер в багажник</CardTitle>
                    <CardDescription>Складной, 3 отделения</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-primary">1 890 ₽</div>
                  </CardContent>
                </Card>

                <Card className="bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-all hover-scale overflow-hidden">
                  <div className="aspect-square bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                    <img src="https://cdn.poehali.dev/projects/59cd723c-a831-4db6-bb34-49d3abf24c65/files/f20471c8-6962-4288-87ec-0dbcc7c968c0.jpg" alt="Заглушки" className="w-full h-full object-cover" />
                  </div>
                  <CardHeader>
                    <CardTitle className="text-lg">Заглушки на дефлектор</CardTitle>
                    <CardDescription>Индивидуальный подбор под модель авто</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-primary">420 ₽</div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div>
              <h3 className="text-3xl font-bold mb-8 text-center">Товары для сада</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-all hover-scale overflow-hidden">
                  <div className="aspect-square bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                    <img src="https://cdn.poehali.dev/projects/59cd723c-a831-4db6-bb34-49d3abf24c65/files/230f55bd-00c6-4ccd-923d-c954767a59af.jpg" alt="Маркеры для растений" className="w-full h-full object-cover" />
                  </div>
                  <CardHeader>
                    <CardTitle className="text-lg">Маркеры для растений</CardTitle>
                    <CardDescription>Набор из 10 штук с подписью</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-primary">290 ₽</div>
                  </CardContent>
                </Card>

                <Card className="bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-all hover-scale overflow-hidden">
                  <div className="aspect-square bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                    <img src="https://cdn.poehali.dev/projects/59cd723c-a831-4db6-bb34-49d3abf24c65/files/3801de41-244a-4c5c-b6f3-84a087d0ea00.jpg" alt="Кормушка для птиц" className="w-full h-full object-cover" />
                  </div>
                  <CardHeader>
                    <CardTitle className="text-lg">Кормушка для птиц</CardTitle>
                    <CardDescription>Влагостойкий материал PETG</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-primary">980 ₽</div>
                  </CardContent>
                </Card>

                <Card className="bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-all hover-scale overflow-hidden">
                  <div className="aspect-square bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                    <img src="https://cdn.poehali.dev/projects/59cd723c-a831-4db6-bb34-49d3abf24c65/files/a4cb794c-dc43-4202-b59c-6fb1abd17a17.jpg" alt="Система полива" className="w-full h-full object-cover" />
                  </div>
                  <CardHeader>
                    <CardTitle className="text-lg">Капельный полив</CardTitle>
                    <CardDescription>Комплект соединений для системы</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-primary">1 450 ₽</div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="faq" className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-16 animate-fade-in">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">Часто задаваемые вопросы</h2>
              <p className="text-xl text-muted-foreground">
                Ответы на популярные вопросы о 3D печати
              </p>
            </div>

            <div className="space-y-4">
              <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
                <CardHeader>
                  <CardTitle className="text-lg">Какие материалы вы используете?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Мы работаем с различными материалами: PLA (биоразлагаемый пластик, идеален для декора и прототипов), 
                    ABS (прочный, термостойкий), PETG (влагостойкий, химически стойкий) и TPU (гибкий, эластичный). 
                    Печатаем на FDM принтерах, скоро появится фотополимерный принтер для ещё более детальных изделий.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
                <CardHeader>
                  <CardTitle className="text-lg">Сколько времени занимает печать?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Время печати зависит от размера и сложности модели. Небольшие изделия (до 10 см) — 2-6 часов, 
                    средние (10-20 см) — 6-12 часов, крупные заказы могут занять до 24-48 часов. 
                    Точные сроки обсуждаем индивидуально.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
                <CardHeader>
                  <CardTitle className="text-lg">Можно ли напечатать мою 3D модель?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Да! Присылайте файлы в форматах STL, OBJ или 3MF. Если у вас нет готовой модели, 
                    мы можем создать её по вашему эскизу или фотографии. Также есть 3D сканер CR-Scan Raptor 
                    (точность 0,02 мм, 60fps) для сканирования физических объектов.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
                <CardHeader>
                  <CardTitle className="text-lg">Какая точность печати?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    FDM печать обеспечивает точность до 0,1-0,2 мм, что подходит для большинства задач. 
                    Для особо точных деталей (украшения, стоматология, ювелирка) скоро будет доступен 
                    фотополимерный принтер с точностью до 0,025 мм.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
                <CardHeader>
                  <CardTitle className="text-lg">Вы печатаете фигурки под раскраску?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Конечно! Фигурки под раскраску — одна из наших специализаций. Используем белый PLA или грунтуем модель, 
                    чтобы краска ложилась ровно. Популярны персонажи игр, аниме, superhero фигурки и кастомные модели.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
                <CardHeader>
                  <CardTitle className="text-lg">Как рассчитывается стоимость?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Цена зависит от объёма изделия (в см³), материала и сложности модели. Воспользуйтесь калькулятором на сайте 
                    для примерной оценки. Итоговая стоимость включает работу, материал и доставку по городу (300₽).
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
                <CardHeader>
                  <CardTitle className="text-lg">Какие услуги 3D сканирования вы предлагаете?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    У нас есть 3D сканер CR-Scan Raptor с точностью 0,02 мм и скоростью 60fps. Можем отсканировать 
                    предметы, скульптуры, запчасти для создания точных цифровых копий. Идеально для реверс-инжиниринга 
                    и создания дубликатов сложных деталей.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
                <CardHeader>
                  <CardTitle className="text-lg">Доставляете ли вы заказы?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Да, доставка по городу включена в стоимость (300₽). Также можем отправить по России через 
                    СДЭК или Почту РФ — стоимость рассчитывается индивидуально. Возможен самовывоз (бесплатно).
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
                <CardHeader>
                  <CardTitle className="text-lg">Можно ли заказать оптом?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Да, мы работаем с оптовыми заказами. При больших объёмах (от 50 шт.) предоставляем скидку до 20%. 
                    Обсудим детали и сроки индивидуально — пишите в Telegram.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
                <CardHeader>
                  <CardTitle className="text-lg">Как начать работу?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Просто напишите нам в Telegram (@levodel_maksim) с описанием задачи или файлом модели. 
                    Мы обсудим детали, рассчитаем стоимость и сроки. После согласования приступаем к печати. 
                    Работаем круглосуточно!
                  </p>
                </CardContent>
              </Card>
            </div>
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