#ifndef EDEMBED_H
#define EDEMBED_H

#include <QtGui>
#include <QWidget>
#include <QX11EmbedContainer>
#include <QProcess>
#include <qtbrowserplugin.h>
#include <QSettings>
#include <QTemporaryFile>

#include "xmouse.h"

class Edembed : public QWidget, public QtNPBindable {
Q_OBJECT
Q_CLASSINFO("MIME", "application/x-edembed:---:--")
//Q_CLASSINFO("ToSuperClass", "Edembed")
  Q_PROPERTY(QString text READ text WRITE setText)
  //  Q_CLASSINFO("DefaultProperty", "text")
public:
  Edembed(QWidget *parent = 0);
  virtual ~Edembed();
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
  QTemporaryFile* getTempFile(const QByteArray &textarea_id, const QByteArray &originalText);
  
  bool tabVisible; //are we in a visible tab
  bool windowActive; //is the browser window active
  QProcess *process;
  QX11EmbedContainer *container;
  Xmouse *xmouse;
  QTemporaryFile *tmpfile;
  QSettings settings;
};

#endif // EDEMBED_H









