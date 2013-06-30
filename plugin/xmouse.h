#ifndef __XMOUSE_H_
#define __XMOUSE_H_

#include <QThreadPool>
#include <QObject>
#include <QRunnable>
#include <QDebug>
#include <QMutex> 

#include <X11/Xlib.h>
#include "manymouse.h"


class XException {};

class Xmouse : public QObject, public QRunnable
{
  Q_OBJECT
  public:
  static Xmouse* subscribe();
  static void unsubscribe();
  void resetFocus();
protected:
  void run();
signals:
  void press(int x, int y, int button);
  void release(int x, int y, int button);
private:
  Xmouse(QObject *parent = 0);
  virtual ~Xmouse();

  static Xmouse *instance;
  static int no_subscribers;

  XEvent xevent;
  Display *display;
  Window window;
};

#endif // __XMOUSE_H_
