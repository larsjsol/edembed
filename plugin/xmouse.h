#ifndef __XMOUSE_H_
#define __XMOUSE_H_

#include <QObject>
#include <QDebug>
#include <QRunnable>

#include <X11/Xlib.h>
#include "manymouse.h"


class XException {};

class Xmouse : public QObject, public QRunnable
{
  Q_OBJECT
  public:
  Xmouse(QObject *parent = 0);
  void quit();
  void resetFocus();
  virtual ~Xmouse();
protected:
  void run();
signals:
  void press(int x, int y, int button);
  void release(int x, int y, int button);
private:
  XEvent xevent;

  Display *display;
  Window window;

  bool done;
};

#endif // __XMOUSE_H_
