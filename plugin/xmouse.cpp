#include "xmouse.h"

Xmouse* Xmouse::instance = NULL;
int Xmouse::no_subscribers = 0;

static QMutex mutex;

Xmouse *Xmouse::subscribe() {
  mutex.lock();
  if (instance == NULL) { 
    instance = new Xmouse();
    no_subscribers = 1;
    QThreadPool::globalInstance()->start(instance);
  } else {
    no_subscribers++;
  }
  mutex.unlock();
  return instance;
}

void Xmouse::unsubscribe() {
  mutex.lock();
  no_subscribers--;
  if (no_subscribers == 0) {
    QThreadPool::globalInstance()->waitForDone();
    delete instance;
    instance = NULL;
  }
  mutex.unlock();
}


void Xmouse::resetFocus() {
  XSetInputFocus(display, None, RevertToNone, CurrentTime);
}

Xmouse::Xmouse(QObject *parent) 
  :QObject(parent), QRunnable()  {
  
  setAutoDelete(false);

  if ((display = XOpenDisplay(NULL)) == NULL )
    throw XException();
  
  if (0 >= ManyMouse_Init()) {
    ManyMouse_Quit();
    throw XException();
  }
  window = DefaultRootWindow(display);
}

Xmouse::~Xmouse() {
  ManyMouse_Quit();
  XFree(display);
}

void Xmouse::run() {
  ManyMouseEvent mmevent;

  Window root_window;
  Window child_window;
  int root_x, root_y, win_x, win_y;
  unsigned int mask;

  while (no_subscribers) {
    while(ManyMouse_PollEvent(&mmevent)) {
      if (mmevent.type == MANYMOUSE_EVENT_BUTTON) {
        XQueryPointer(display, window, &root_window,
                      &child_window, &root_x, &root_y,
                      &win_x, &win_y, &mask);
        if (mmevent.value == 0) 
          emit press(root_x, root_y, mmevent.item);
        else
          emit release(root_x, root_y, mmevent.item);
      }
    }
  }
}

