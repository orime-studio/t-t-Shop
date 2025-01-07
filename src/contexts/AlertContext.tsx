// src/contexts/AlertContext.tsx
import React, { createContext, useState, useContext, ReactNode } from 'react';
import Alert from '../components/Alert';

// הגדרת סוגי האלרטים
type AlertType = 'success' | 'error' | 'warning' | 'info';

// הגדרת הממשק של ה-Context
interface AlertContextProps {
  showAlert: (type: AlertType, message: string) => void;
}

// יצירת ה-Context עם ערך ברירת מחדל (פונקציה ריקה)
const AlertContext = createContext<AlertContextProps>({
  showAlert: () => {}, // פונקציה ריקה כברירת מחדל
});

// הגדרת הפרופס של ה-Provider
interface AlertProviderProps {
  children: ReactNode;
}

// יצירת ה-Provider
export const AlertProvider: React.FC<AlertProviderProps> = ({ children }) => {
  const [alert, setAlert] = useState<{ show: boolean; type: AlertType; message: string }>({
    show: false,
    type: 'info',
    message: '',
  });

  // פונקציה להצגת האלרט
  const showAlert = (type: AlertType, message: string) => {
    setAlert({ show: true, type, message });
    // סגירת האלרט לאחר 3 שניות
    setTimeout(() => {
      setAlert({ show: false, type: 'info', message: '' });
    }, 3000);
  };

  return (
    <AlertContext.Provider value={{ showAlert }}> {/* עדכון כאן */}
      {children}
      {alert.show && (
        <div className="fixed top-4 right-4 z-50">
          <Alert
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert({ show: false, type: 'info', message: '' })}
          />
        </div>
      )}
    </AlertContext.Provider>
  );
};

// הוק לשימוש קל יותר ב-Context
export const useAlert = () => useContext(AlertContext);
