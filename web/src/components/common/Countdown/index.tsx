import { useEffect, useState } from "react";
import dayjs from "dayjs";

interface CountdownProps {
  targetDate: string;
}

const Countdown = ({ targetDate }: CountdownProps) => {
  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = dayjs();
      const end = dayjs(targetDate);
      const diff = end.diff(now);
      setTimeLeft(Math.max(0, diff));
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const hours = Math.floor(timeLeft / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeft / (1000 * 60)) % 60);
  const seconds = Math.floor((timeLeft / 1000) % 60);

  const formatTime = (val: number) => val.toString().padStart(2, '0');

  return (
    <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
      <span style={{ background: '#000', color: '#fff', padding: '2px 4px', borderRadius: '4px', fontWeight: 700 }}>{formatTime(hours)}</span>
      <span style={{ fontWeight: 700 }}>:</span>
      <span style={{ background: '#000', color: '#fff', padding: '2px 4px', borderRadius: '4px', fontWeight: 700 }}>{formatTime(minutes)}</span>
      <span style={{ fontWeight: 700 }}>:</span>
      <span style={{ background: '#000', color: '#fff', padding: '2px 4px', borderRadius: '4px', fontWeight: 700 }}>{formatTime(seconds)}</span>
    </div>
  );
};

export default Countdown;
