#include "edowser.h"

#include <QApplication>
#include <QDebug>
#include <QRect>
#include <QStringList>
#include <QEvent>
#include <QResizeEvent>
#include <QTimer>

Edowser::Edowser(QWidget *parent)
  : QX11EmbedContainer(parent) {  
  qDebug() << "XID:" << this->winId();

  //there appears to be a bug in emacs that makes it use a tiny part of the window until it's resized
  //to make matters worse, this has no effect until it's completely finsihed with its startup files
  QTimer::singleShot(1000, this, SLOT(resizeNudge()));
  QTimer::singleShot(5000, this, SLOT(resizeNudge()));
  QTimer::singleShot(10000, this, SLOT(resizeNudge()));
}  

Edowser::~Edowser(){
  process->waitForFinished();
  delete process;
}

void Edowser::show() {
  QX11EmbedContainer::show();

  QString command = QString("emacs ");
  command.append("--parent-id ");
  command.append(QString::number(this->winId()));
  process = new QProcess(this);
  qDebug() << "editor command:" << command;
  process->start(command);
  qDebug() << "editor PID:" << process->pid();
  process->waitForStarted();
}

void Edowser::resizeNudge() {
  const int width = this->width();
  const int height = this->height();

  qDebug() << "resizeNudge()";

  QResizeEvent event1(QSize(width, height), QSize(width + 1, height + 1));
  QResizeEvent event2(QSize(width + 1, height + 1), QSize(width, height));
  QCoreApplication::sendEvent(this, &event1);
  QCoreApplication::sendEvent(this, &event2);
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
