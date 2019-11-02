CREATE TABLE projects (
  id mediumint(8) unsigned NOT NULL AUTO_INCREMENT,
  name varchar(200) NOT NULL,
  tables json DEFAULT NULL,
  PRIMARY KEY (id)
);

INSERT INTO projects (name, tables)
VALUES (
  '${name}',
  '${json}'
);

curl -X POST https://us-central1-pivotal-keep-256007.cloudfunctions.net/api/input/project -H "Accept: application/json" -H "Content-type: application/json" -d '{"id":"qLVOK6XS","name":"プロジェクト","tables":[{"id":"Nco5avm8","name":"Demand最小粒度テーブル","columns":[{"id":"_dOhsbx2","data":{"name":"ユーザーID","logicName":"user_id","type":"int","supplementation":"8桁の数値","calc":"","ispk":true,"defaultvalue":"","from":"","example":""}},{"id":"KtdzGiml","data":{}}]}]}