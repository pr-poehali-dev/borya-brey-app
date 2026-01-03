import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { api, type Booking, type Salon, type Master, type Service } from '@/lib/api';

const Admin = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [salons, setSalons] = useState<Salon[]>([]);
  const [masters, setMasters] = useState<Master[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [bookingsData, salonsData, mastersData, servicesData] = await Promise.all([
        api.getBookings(),
        api.getSalons(),
        api.getMasters(),
        api.getServices()
      ]);
      setBookings(bookingsData);
      setSalons(salonsData);
      setMasters(mastersData);
      setServices(servicesData);
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSalonName = (salonId: number) => {
    return salons.find(s => s.id === salonId)?.name || 'Неизвестно';
  };

  const getMasterName = (masterId: number) => {
    return masters.find(m => m.id === masterId)?.name || 'Неизвестно';
  };

  const getServiceName = (serviceId: number) => {
    return services.find(s => s.id === serviceId)?.name || 'Неизвестно';
  };

  const upcomingBookings = bookings.filter(b => b.status === 'upcoming');
  const completedBookings = bookings.filter(b => b.status === 'completed');

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <Icon name="Loader2" className="animate-spin mx-auto mb-4" size={48} />
          <p className="text-slate-600">Загрузка данных...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Шапка */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Панель администратора</h1>
          <p className="text-slate-600">Управление записями салонов красоты</p>
        </div>

        {/* Статистика */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm mb-1">Всего записей</p>
                <p className="text-3xl font-bold">{bookings.length}</p>
              </div>
              <Icon name="Calendar" size={40} className="opacity-80" />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-green-500 to-green-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm mb-1">Предстоящие</p>
                <p className="text-3xl font-bold">{upcomingBookings.length}</p>
              </div>
              <Icon name="Clock" size={40} className="opacity-80" />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm mb-1">Завершённые</p>
                <p className="text-3xl font-bold">{completedBookings.length}</p>
              </div>
              <Icon name="CheckCircle" size={40} className="opacity-80" />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm mb-1">Салонов</p>
                <p className="text-3xl font-bold">{salons.length}</p>
              </div>
              <Icon name="Building2" size={40} className="opacity-80" />
            </div>
          </Card>
        </div>

        {/* Таблица записей */}
        <Card className="p-6">
          <Tabs defaultValue="upcoming">
            <TabsList className="mb-6">
              <TabsTrigger value="upcoming">
                <Icon name="Clock" size={16} className="mr-2" />
                Предстоящие ({upcomingBookings.length})
              </TabsTrigger>
              <TabsTrigger value="completed">
                <Icon name="CheckCircle" size={16} className="mr-2" />
                Завершённые ({completedBookings.length})
              </TabsTrigger>
              <TabsTrigger value="all">
                <Icon name="List" size={16} className="mr-2" />
                Все ({bookings.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming">
              <BookingsTable bookings={upcomingBookings} getSalonName={getSalonName} getMasterName={getMasterName} getServiceName={getServiceName} />
            </TabsContent>

            <TabsContent value="completed">
              <BookingsTable bookings={completedBookings} getSalonName={getSalonName} getMasterName={getMasterName} getServiceName={getServiceName} />
            </TabsContent>

            <TabsContent value="all">
              <BookingsTable bookings={bookings} getSalonName={getSalonName} getMasterName={getMasterName} getServiceName={getServiceName} />
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

interface BookingsTableProps {
  bookings: Booking[];
  getSalonName: (id: number) => string;
  getMasterName: (id: number) => string;
  getServiceName: (id: number) => string;
}

const BookingsTable = ({ bookings, getSalonName, getMasterName, getServiceName }: BookingsTableProps) => {
  if (bookings.length === 0) {
    return (
      <div className="text-center py-12">
        <Icon name="Inbox" size={48} className="mx-auto mb-4 text-slate-300" />
        <p className="text-slate-500">Записей нет</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-200">
            <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">ID</th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Салон</th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Мастер</th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Услуга</th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Дата</th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Время</th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Клиент</th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Телефон</th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Статус</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
              <td className="py-4 px-4 text-sm text-slate-600">#{booking.id}</td>
              <td className="py-4 px-4 text-sm text-slate-900">{getSalonName(booking.salon_id)}</td>
              <td className="py-4 px-4 text-sm text-slate-900">{getMasterName(booking.master_id)}</td>
              <td className="py-4 px-4 text-sm text-slate-900">{getServiceName(booking.service_id)}</td>
              <td className="py-4 px-4 text-sm text-slate-600">
                {new Date(booking.booking_date).toLocaleDateString('ru-RU')}
              </td>
              <td className="py-4 px-4 text-sm text-slate-600">{booking.booking_time}</td>
              <td className="py-4 px-4 text-sm text-slate-900">{booking.client_name || '—'}</td>
              <td className="py-4 px-4 text-sm text-slate-600">{booking.client_phone || '—'}</td>
              <td className="py-4 px-4">
                <Badge variant={booking.status === 'upcoming' ? 'default' : 'secondary'}>
                  {booking.status === 'upcoming' ? 'Предстоящая' : 'Завершена'}
                </Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Admin;
