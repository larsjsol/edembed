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
  Q_PROPERTY(QString text READ text WRITE setText)
  Q_CLASSINFO("DefaultProperty", "text")
public:
  Edowser(QWidget *parent = 0);
  virtual ~Edowser();
  QString text() const;
public slots:
  void mouse_press(int x, int y, int button);
  void mouse_release(int x, int y, int button);
  void dummy_resize();
  void setText(const QString &text);
  void pageFocus();
  void pageBlur();
protected:
  void resizeEvent(QResizeEvent *event);
  bool event(QEvent *event);
private:
  void format(QString *frm_str, const QString &filename, const QString &xid);
  
  bool tabVisible; //are we in a visible tab
  bool windowActive; //is the browser window active
  QProcess *process;
  QX11EmbedContainer *container;
  Xmouse *xmouse;
  QTemporaryFile *tmpfile;

};

#endif //__EDOWSER_H_
