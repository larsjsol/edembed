#ifndef __EDOWSER_H_
#define __EDOWSER_H_

#include <QtGui>
#include <QWidget>
#include <QX11EmbedContainer>
#include <QProcess>
#include <qtbrowserplugin.h>

#include "xmouse.h"

class Edowser : public QWidget, public QtNPBindable {
Q_OBJECT
Q_CLASSINFO("MIME", "application/x-edowser:---:--")
//Q_CLASSINFO("ToSuperClass", "Edowser")
public:
  Edowser(QWidget *parent = 0);
  virtual ~Edowser();
  void show();
public slots:
  void mouse_press(int x, int y, int button);
  void mouse_release(int x, int y, int button);
  void dummy_resize();
protected:
  void resizeEvent(QResizeEvent *event);
private:
  bool grabKB;
  QProcess *process;
  QX11EmbedContainer *container;
  Xmouse *xmouse;
};

#endif //__EDOWSER_H_
