import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';

interface Booking {
  id: number;
  service: string;
  master: string;
  date: string;
  time: string;
  status: 'upcoming' | 'completed';
}

interface Promo {
  id: number;
  title: string;
  description: string;
  discount: string;
  validUntil: string;
}

const Index = () => {
  const navigate = useNavigate();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedSalon, setSelectedSalon] = useState('');
  const [selectedMaster, setSelectedMaster] = useState('');
  const [selectedService, setSelectedService] = useState('');

  const bookings: Booking[] = [
    {
      id: 1,
      service: 'Стрижка + Борода',
      master: 'Антон Борисов',
      date: '15 января',
      time: '14:00',
      status: 'upcoming'
    },
    {
      id: 2,
      service: 'Стрижка',
      master: 'Дмитрий Волков',
      date: '20 декабря',
      time: '16:30',
      status: 'completed'
    }
  ];

  const promos: Promo[] = [
    {
      id: 1,
      title: 'Новогодняя акция',
      description: 'Стрижка + укладка по специальной цене',
      discount: '-20%',
      validUntil: '31 января'
    },
    {
      id: 2,
      title: 'Приведи друга',
      description: 'Получи 500 бонусных баллов за каждого друга',
      discount: '+500',
      validUntil: 'Постоянно'
    }
  ];

  const salons = [
    { id: 1, name: 'Боря Брей - Центр', address: 'ул. Ленина, 45' },
    { id: 2, name: 'Боря Брей - Автозаводский', address: 'ул. Южное шоссе, 12' }
  ];

  const masters = [
    { id: 1, name: 'Антон Борисов', rating: 4.9 },
    { id: 2, name: 'Дмитрий Волков', rating: 4.8 },
    { id: 3, name: 'Игорь Смирнов', rating: 5.0 }
  ];

  const services = [
    { id: 1, name: 'Стрижка', price: 1200, duration: '45 мин' },
    { id: 2, name: 'Борода', price: 800, duration: '30 мин' },
    { id: 3, name: 'Стрижка + Борода', price: 1800, duration: '60 мин' },
    { id: 4, name: 'Королевское бритьё', price: 1500, duration: '50 мин' }
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="bg-card border-b border-border px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-1">БОРЯ БРЕЙ</h1>
            <p className="text-sm text-muted-foreground">Барбершоп в Тольятти</p>
          </div>
          <Button variant="ghost" size="icon">
            <Icon name="Bell" size={20} />
          </Button>
        </div>

        <div className="flex items-center gap-3 bg-secondary/50 p-4 rounded-lg">
          <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full">
            <Icon name="Gift" size={24} className="text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">Бонусный баланс</p>
            <p className="text-2xl font-bold text-primary">1,240</p>
          </div>
          <Button size="sm" variant="outline">
            История
          </Button>
        </div>
      </div>

      <div className="px-4 py-6">
        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full h-14 text-lg font-semibold" size="lg">
              <Icon name="CalendarPlus" className="mr-2" size={20} />
              ЗАПИСАТЬСЯ
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-[95vw] md:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-2xl">Онлайн-запись</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Салон</label>
                <Select value={selectedSalon} onValueChange={setSelectedSalon}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите салон" />
                  </SelectTrigger>
                  <SelectContent>
                    {salons.map((salon) => (
                      <SelectItem key={salon.id} value={salon.name}>
                        <div className="flex flex-col items-start">
                          <span className="font-medium">{salon.name}</span>
                          <span className="text-xs text-muted-foreground">{salon.address}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Услуга</label>
                <Select value={selectedService} onValueChange={setSelectedService}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите услугу" />
                  </SelectTrigger>
                  <SelectContent>
                    {services.map((service) => (
                      <SelectItem key={service.id} value={service.name}>
                        <div className="flex justify-between items-center w-full">
                          <span>{service.name}</span>
                          <span className="text-primary font-semibold ml-4">{service.price} ₽</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Мастер</label>
                <Select value={selectedMaster} onValueChange={setSelectedMaster}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите мастера" />
                  </SelectTrigger>
                  <SelectContent>
                    {masters.map((master) => (
                      <SelectItem key={master.id} value={master.name}>
                        <div className="flex items-center gap-2">
                          <span>{master.name}</span>
                          <span className="flex items-center text-xs text-primary">
                            <Icon name="Star" size={12} className="mr-1 fill-current" />
                            {master.rating}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Дата и время</label>
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md border"
                />
              </div>

              <Button className="w-full" size="lg">
                ПОДТВЕРДИТЬ ЗАПИСЬ
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="bookings" className="px-4">
        <TabsList className="w-full grid grid-cols-3 mb-6">
          <TabsTrigger value="bookings">Записи</TabsTrigger>
          <TabsTrigger value="promos">Акции</TabsTrigger>
          <TabsTrigger value="contacts">Контакты</TabsTrigger>
        </TabsList>

        <TabsContent value="bookings" className="space-y-4 animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">МОИ ЗАПИСИ</h2>
            <Badge variant="secondary">{bookings.filter(b => b.status === 'upcoming').length}</Badge>
          </div>
          
          {bookings.map((booking) => (
            <Card key={booking.id} className="p-4 hover:bg-secondary/50 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-lg mb-1">{booking.service}</h3>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Icon name="User" size={14} />
                    {booking.master}
                  </p>
                </div>
                <Badge variant={booking.status === 'upcoming' ? 'default' : 'secondary'}>
                  {booking.status === 'upcoming' ? 'Предстоит' : 'Завершено'}
                </Badge>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Icon name="Calendar" size={14} />
                  {booking.date}
                </span>
                <span className="flex items-center gap-1">
                  <Icon name="Clock" size={14} />
                  {booking.time}
                </span>
              </div>
              {booking.status === 'upcoming' && (
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm" className="flex-1">
                    Перенести
                  </Button>
                  <Button variant="destructive" size="sm" className="flex-1">
                    Отменить
                  </Button>
                </div>
              )}
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="promos" className="space-y-4 animate-fade-in">
          <h2 className="text-xl font-bold mb-4">АКЦИИ И НОВОСТИ</h2>
          
          {promos.map((promo) => (
            <Card key={promo.id} className="p-4 relative overflow-hidden hover:scale-[1.02] transition-transform">
              <div className="absolute top-4 right-4">
                <Badge className="text-lg font-bold px-3 py-1">{promo.discount}</Badge>
              </div>
              <h3 className="font-bold text-lg mb-2 pr-16">{promo.title}</h3>
              <p className="text-sm text-muted-foreground mb-3">{promo.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Icon name="Clock" size={12} />
                  До {promo.validUntil}
                </span>
                <Button size="sm" variant="outline">
                  Подробнее
                </Button>
              </div>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="contacts" className="space-y-4 animate-fade-in">
          <h2 className="text-xl font-bold mb-4">НАШИ САЛОНЫ</h2>
          
          {salons.map((salon) => (
            <Card key={salon.id} className="p-4">
              <h3 className="font-bold text-lg mb-2">{salon.name}</h3>
              <p className="text-sm text-muted-foreground mb-4 flex items-center gap-2">
                <Icon name="MapPin" size={14} />
                {salon.address}
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Icon name="Phone" size={14} className="mr-2" />
                  Позвонить
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Icon name="Navigation" size={14} className="mr-2" />
                  Маршрут
                </Button>
              </div>
            </Card>
          ))}

          <Card className="p-4 bg-secondary/50">
            <div className="flex items-center gap-3 mb-3">
              <Icon name="Clock" size={20} className="text-primary" />
              <h3 className="font-semibold">Режим работы</h3>
            </div>
            <p className="text-sm text-muted-foreground">Ежедневно: 9:00 - 21:00</p>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border">
        <div className="flex items-center justify-around py-3 px-4">
          <Button variant="default" size="sm" className="flex-col h-auto py-2">
            <Icon name="Home" size={20} />
            <span className="text-xs mt-1">Главная</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex-col h-auto py-2">
            <Icon name="Calendar" size={20} />
            <span className="text-xs mt-1">Записи</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex-col h-auto py-2">
            <Icon name="Gift" size={20} />
            <span className="text-xs mt-1">Бонусы</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex-col h-auto py-2" onClick={() => navigate('/profile')}>
            <Icon name="User" size={20} />
            <span className="text-xs mt-1">Профиль</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;