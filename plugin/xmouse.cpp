#include "xmouse.h"

Xmouse::Xmouse(QObject *parent) 
  :QObject(parent), QRunnable()  {

  done = false;
  
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
}

void Xmouse::run() {
  ManyMouseEvent mmevent;

  Window root_window;
  Window child_window;
  int root_x, root_y, win_x, win_y;
  unsigned int mask;

  while (!done) {
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

void Xmouse::quit() {
  done = true;
}
