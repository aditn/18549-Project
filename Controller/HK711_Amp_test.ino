#define ADDO 7 // Data Out
#define ADSK 6 // SCK

unsigned long ReadCount();

unsigned long convert;


void setup() {
  // put your setup code here, to run once:

  pinMode(ADDO, INPUT_PULLUP);
  pinMode(ADSK, OUTPUT);

  Serial.begin(9600);
}

void loop() {
  // put your main code here, to run repeatedly:

  convert = ReadCount();

  Serial.println(convert);

  delay(2000);
 
}

unsigned long ReadCount() {
  unsigned long Count = 0;
  unsigned char i;

  digitalWrite(ADSK, LOW);

  while (digitalRead(ADDO));

  for (i=0; i < 24; i++) {
    digitalWrite(ADSK, HIGH);
    Count = Count << 1;
    digitalWrite(ADSK, LOW);
    if (digitalRead(ADDO)) Count++;
  }

  digitalWrite(ADSK, HIGH);
  Count = Count^0x800000;
  digitalWrite(ADSK, LOW);

  return (Count);
  
}

