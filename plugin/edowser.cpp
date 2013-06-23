#include "edowser.h"
#include "xmouse.h"

#include <QApplication>
#include <QDebug>
#include <QRect>
#include <QStringList>
#include <QEvent>
#include <QResizeEvent>
#include <QTimer>
#include <QX11EmbedContainer>
#include <QThreadPool>

Edowser::Edowser(QWidget *parent)
  : QWidget(parent) {
  
  //we cant get focus the normal way, so we use manymouse/xlib to get mousevents
  xmouse = new Xmouse();
  connect(xmouse, SIGNAL(press(int, int, int)), this, SLOT(mouse_press(int, int, int)));
  connect(xmouse, SIGNAL(release(int, int, int)), this, SLOT(mouse_release(int, int, int)));
  QThreadPool::globalInstance()->start(xmouse);

  //create a containser-widget
  container = new QX11EmbedContainer(this);
  container->setGeometry(0, 0, width(), height());
  qDebug() << "XID:" << container->winId();
  
  //start an editor that embeds itself into our widget
  QString command = QString("xterm ");
  command.append("-into ");
  command.append(QString::number(container->winId()));
  process = new QProcess(this);
  qDebug() << "editor command:" << command;
  process->start(command);
  qDebug() << "editor PID:" << process->pid();
  process->waitForStarted();
  
  container->show();
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
  qDebug() << "mouse_press: " << x << y << button; 
}

void Edowser::mouse_release(int x, int y, int button) {
  qDebug() << "mouse_release: " << x << y << button; 
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
