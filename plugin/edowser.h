#ifndef __EDOWSER_H_
#define __EDOWSER_H_

#include <QWidget>
#include <QX11EmbedContainer>
#include <QProcess>

class Edowser : public QX11EmbedContainer{
Q_OBJECT
public:
  Edowser(QWidget *parent = 0);
  virtual ~Edowser();
  void show();
public slots:
  void resizeNudge();
private:
  QProcess *process;
};



#endif //__EDOWSER_H_
