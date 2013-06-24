#include "edowser.h"
#include "xmouse.h"

#include <QApplication>
#include <QDebug>
#include <QX11EmbedContainer>
#include <QThreadPool>
#include <QTimer>


Edowser::Edowser(QWidget *parent)
  : QWidget(parent), QtNPBindable() {

  //we cant get focus the normal way, so we use manymouse/xlib to get mousevents
  xmouse = new Xmouse();
  connect(xmouse, SIGNAL(press(int, int, int)), this, SLOT(mouse_press(int, int, int)));
  // connect(xmouse, SIGNAL(release(int, int, int)), this, SLOT(mouse_release(int, int, int)));
  QThreadPool::globalInstance()->start(xmouse);

  //create a containser-widget
  container = new QX11EmbedContainer(this);
  qDebug() << "XID:" << container->winId();

  qDebug() << "parameters:";
  QMap<QByteArray, QVariant>::const_iterator i = parameters().constBegin();
  while (i != parameters().constEnd()) {
    qDebug() << i.key() << "=" << i.value();
    ++i;
  }

  //start an editor that embeds itself into our widget
  QString command = QString("xterm -into ");
  //QString command("emacs --parent-id ");
  command.append(QString::number(container->winId()));

  grabKB = command.contains("emacs"); //our focus hack doesn't for for emacs...
               
  process = new QProcess(this);
  qDebug() << "editor command:" << command;
  process->start(command);
  qDebug() << "editor PID:" << process->pid();
  process->waitForStarted();

  //emacs ignores resizeevents until after it is done initializing 
  QTimer::singleShot(1000, this, SLOT(dummy_resize()));
  QTimer::singleShot(5000, this, SLOT(dummy_resize()));
  QTimer::singleShot(10000, this, SLOT(dummy_resize()));
}

Edowser::~Edowser(){
  xmouse->quit(); //xmouse is deleted by QTreadPool
  QThreadPool::globalInstance()->waitForDone();
  process->terminate();
  process->waitForFinished();
  delete container;
  delete process;
}

void Edowser::mouse_press(int x, int y, int button) {
  if (button == 0) { //first (left) mouse button
    xmouse->resetFocus();
    
    QPoint lpoint = mapFromGlobal(QPoint(x, y));
    if (geometry().contains(lpoint)) { 
      QApplication::setActiveWindow(this);
      if (grabKB)
        container->grabKeyboard();
    } else {
      if (grabKB)
        container->releaseKeyboard();
    }
  }
}

//it appears focus is broken in qtbrowserplugin, here we try to set it manualy instead
void Edowser::mouse_release(int x, int y, int button) {
  (void)x;
  (void)y;
  (void)button;
}

void Edowser::dummy_resize() {
  int w = width();
  int h = height();
  resize(w + 1, h);
  resize(w, h);
}

void Edowser::resizeEvent(QResizeEvent *event) {
  container->setGeometry(0, 0, event->size().width(), event->size().width());
}


int main(int argc, char *argv[]){
  QApplication app(argc, argv);

  Edowser *e = new Edowser();
  e->resize(500, 300);
  e->setWindowTitle("Edowser");
  e->show();

  int retval = app.exec();
  delete e;

  return retval;
}

QTNPFACTORY_BEGIN("Edowser", "A plugin that lets you edit textareas with a proper editor.")
QTNPCLASS(Edowser)
QTNPFACTORY_END()
