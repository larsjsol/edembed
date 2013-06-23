#include "edowser.h"

#include <QApplication>
#include <QDebug>
#include <QRect>
#include <QStringList>
#include <QEvent>
#include <QResizeEvent>
#include <QTimer>

Edowser::Edowser(QWidget *parent)
  : QWidget(parent) {  
  
  container = new QX11EmbedContainer(this);
  container->setGeometry(0, 0, this->width(), this->height());

  qDebug() << "XID:" << container->winId();
  QString command = QString("xterm ");
  command.append("-into ");
  command.append(QString::number(container->winId()));
  process = new QProcess(this);
  qDebug() << "editor command:" << command;
  process->start(command);
  qDebug() << "editor PID:" << process->pid();
  process->waitForStarted();


  //there appears to be a bug in emacs that makes it use a tiny part of the window until it's resized
  //to make matters worse, this has no effect until it's completely finsihed with its startup files
  //QTimer::singleShot(1000, this, SLOT(resizeNudge()));
  //QTimer::singleShot(5000, this, SLOT(resizeNudge()));
  //QTimer::singleShot(10000, this, SLOT(resizeNudge()));

}  

Edowser::~Edowser(){
  process->waitForFinished();
  delete process;
  delete container;
}

void Edowser::resizeNudge() {
  const int width = this->width();
  const int height = this->height();

  qDebug() << "resizeNudge()";
  
  QResizeEvent event1(QSize(width, height), QSize(width + 1, height + 1));
  QResizeEvent event2(QSize(width + 1, height + 1), QSize(width, height));
  QCoreApplication::sendEvent(container, &event1);
  QCoreApplication::sendEvent(container, &event2);
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
