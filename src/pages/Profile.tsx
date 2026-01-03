import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Icon from '@/components/ui/icon';
import { useNavigate } from 'react-router-dom';

interface UserData {
  id: number;
  name: string;
  phone: string;
  email: string;
  bonus_points: number;
  created_at: string;
}

const Profile = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState<UserData>({
    id: 1,
    name: 'Александр Петров',
    phone: '+7 (917) 555-0123',
    email: 'alex@example.com',
    bonus_points: 1240,
    created_at: '2025-06-15'
  });

  const [editData, setEditData] = useState(userData);

  const handleSave = () => {
    setUserData(editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData(userData);
    setIsEditing(false);
  };

  const bonusHistory = [
    { id: 1, points: 100, type: 'Начисление', description: 'За посещение', date: '2 января 2026' },
    { id: 2, points: 50, type: 'Начисление', description: 'Бонус за отзыв', date: '28 декабря 2025' },
    { id: 3, points: -200, type: 'Списание', description: 'Оплата услуги', date: '20 декабря 2025' },
    { id: 4, points: 500, type: 'Начисление', description: 'Приведи друга', date: '15 декабря 2025' }
  ];

  const stats = [
    { label: 'Визитов', value: '12', icon: 'Calendar' },
    { label: 'Бонусов', value: '1,240', icon: 'Gift' },
    { label: 'Скидка', value: '5%', icon: 'TrendingUp' }
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="bg-card border-b border-border px-4 py-6">
        <div className="flex items-center gap-3 mb-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
            <Icon name="ArrowLeft" size={20} />
          </Button>
          <h1 className="text-2xl font-bold">ПРОФИЛЬ</h1>
        </div>

        <div className="flex items-center gap-4 mb-6">
          <Avatar className="w-20 h-20 bg-primary/20">
            <AvatarFallback className="text-2xl font-bold text-primary">
              {userData.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h2 className="text-xl font-bold mb-1">{userData.name}</h2>
            <p className="text-sm text-muted-foreground">Клиент с {new Date(userData.created_at).toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' })}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {stats.map((stat, index) => (
            <Card key={index} className="p-3 text-center">
              <Icon name={stat.icon as any} size={20} className="mx-auto mb-2 text-primary" />
              <p className="text-lg font-bold">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </Card>
          ))}
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold">ЛИЧНЫЕ ДАННЫЕ</h3>
            {!isEditing ? (
              <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                <Icon name="Pencil" size={14} className="mr-2" />
                Редактировать
              </Button>
            ) : null}
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Имя</Label>
              {isEditing ? (
                <Input
                  id="name"
                  value={editData.name}
                  onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                  className="mt-1"
                />
              ) : (
                <p className="mt-1 text-foreground">{userData.name}</p>
              )}
            </div>

            <div>
              <Label htmlFor="phone">Телефон</Label>
              {isEditing ? (
                <Input
                  id="phone"
                  value={editData.phone}
                  onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                  className="mt-1"
                />
              ) : (
                <p className="mt-1 text-foreground">{userData.phone}</p>
              )}
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              {isEditing ? (
                <Input
                  id="email"
                  type="email"
                  value={editData.email}
                  onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                  className="mt-1"
                />
              ) : (
                <p className="mt-1 text-foreground">{userData.email}</p>
              )}
            </div>
          </div>

          {isEditing && (
            <div className="flex gap-2 mt-4">
              <Button onClick={handleSave} className="flex-1">
                Сохранить
              </Button>
              <Button onClick={handleCancel} variant="outline" className="flex-1">
                Отмена
              </Button>
            </div>
          )}
        </Card>

        <Card className="p-4">
          <h3 className="text-lg font-bold mb-4">ИСТОРИЯ БОНУСОВ</h3>
          <div className="space-y-3">
            {bonusHistory.map((item) => (
              <div key={item.id}>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-medium">{item.description}</p>
                    <p className="text-xs text-muted-foreground">{item.date}</p>
                  </div>
                  <div className={`text-lg font-bold ${item.points > 0 ? 'text-primary' : 'text-destructive'}`}>
                    {item.points > 0 ? '+' : ''}{item.points}
                  </div>
                </div>
                {item.id !== bonusHistory[bonusHistory.length - 1].id && (
                  <Separator className="mt-3" />
                )}
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="text-lg font-bold mb-4">НАСТРОЙКИ</h3>
          <div className="space-y-3">
            <Button variant="ghost" className="w-full justify-start" size="lg">
              <Icon name="Bell" size={20} className="mr-3" />
              Уведомления
            </Button>
            <Button variant="ghost" className="w-full justify-start" size="lg">
              <Icon name="HelpCircle" size={20} className="mr-3" />
              Помощь и поддержка
            </Button>
            <Button variant="ghost" className="w-full justify-start" size="lg">
              <Icon name="FileText" size={20} className="mr-3" />
              Условия использования
            </Button>
            <Separator />
            <Button variant="ghost" className="w-full justify-start text-destructive" size="lg">
              <Icon name="LogOut" size={20} className="mr-3" />
              Выйти из аккаунта
            </Button>
          </div>
        </Card>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border">
        <div className="flex items-center justify-around py-3 px-4">
          <Button variant="ghost" size="sm" className="flex-col h-auto py-2" onClick={() => navigate('/')}>
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
          <Button variant="default" size="sm" className="flex-col h-auto py-2">
            <Icon name="User" size={20} />
            <span className="text-xs mt-1">Профиль</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
