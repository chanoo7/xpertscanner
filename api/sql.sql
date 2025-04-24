use demo;
select * from SequelizeMeta;
delete from SequelizeMeta where 1;

desc accounts;

insert into `accounts` values (1, '49f47c9a-f8f8-4cb4-a24e-10648b68d8aa', 'My Legal Name', '{"city":"chennai"}', '{"gst":"1234567890"}', '{"account_no":"1234567890"}',true, false ,'49f47c9a-f8f8-4cb4-a24e-10648b68d8aa','49f47c9a-f8f8-4cb4-a24e-10648b68d8aa', now(), now());

insert into `accounts` values (2, '49f47c9a-f8f8-4cb4-a24c-10648b68d8ff', 'My Seconde Legal Name', '{"city":"chennai"}', '{"gst":"2345678901"}', '[{"index":"0","account_no":"1234567890"},{"index":"1","account_no":"2345678901"}]',true, false ,'49f47c9a-f8f8-4cb4-a24e-10648b68d8aa','49f47c9a-f8f8-4cb4-a24e-10648b68d8aa',now(), now());

insert into `accounts` values (3, '56f47c9a-f9f8-4cb4-a24e-10648b68d8aa', 'My Thrid Legal Name', '{"city":"coimbatore"}', '{"gst":"3456789012"}', '{"account_no":"3456789012"}',false, false,'49f47c9a-f8f8-4cb4-a24e-10648b68d8aa','49f47c9a-f8f8-4cb4-a24e-10648b68d8aa', now(), now());

insert into `accounts` values (4, '78f48c8a-f9f8-4cb4-a24e-10648b68d8aa', 'My Fourth Legal Name', '{"city":"tiruppur"}', '{"gst":"3456789012"}', '{"account_no":"3456789012"}',false, true,'49f47c9a-f8f8-4cb4-a24e-10648b68d8aa','49f47c9a-f8f8-4cb4-a24e-10648b68d8aa', now(), now());

delete from accounts where id = 4;

select * from accounts;


select * from accounts where JSON_EXTRACT(contactInfo, '$.city') like '%chennai%';
select * from accounts where JSON_EXTRACT(bankingInfo, '$.account_no') = '1234567890';
select * from accounts where JSON_EXTRACT(contactInfo, '$.city') = 'chennai';


select id, json_search(contactInfo,'all', 'coimbatore') as result from accounts where result is not null;

select * from accounts where json_search(contactInfo,'all', 'coimbatore');
select * from accounts where json_search(bankingInfo,'all', '1234567890');
select * from accounts where json_search(bankingInfo,'all', '2345678901');

desc accounts;
delete from SequelizeMeta where 1;

desc sites;
desc contacts;
desc users;

select * from SequelizeMeta;

select * from accounts where JSON_EXTRACT(bankingInfo, '$.account_no') = '1234567890';
select * from accounts where JSON_EXTRACT(bankingInfo, '$.account_no') = '2345678901';

drop table contacts;

desc blacklistedTokens;

insert into blacklistedTokens values (1, 'hi', now(),now(),now());

select * from blacklistedTokens;

select * from users;	

update users set isActive = true where username = '7010947415'	;

insert into blacklistedTokens values (1, 'token', now(),now());

update users set isLoggedin = false where username = '7010947414';

update users set failedAttempts = 0 where username = '7010947414';

update users set failedAttempts = 0,isActive = true  where username = '7010947414';

delete from blacklistedTokens;




INSERT INTO `contacts` VALUES ( 1, 'c5fed6e0-d80a-11ef-bf45-dbb631f16bcd', 'Chandrasekaran', 'Symbioteq', '{"city":"chennai"}', 'c5fed6e0-d80a-11ef-bf45-dbb631f16bcd', '{"age": 30, "address": "123 Main St"}', '{"position": "Developer", "salary": 60000}', '{"bankName": "Some Bank", "accountNumber": "1234567890"}', '{"note": "Special note"}', '3', '3', NOW(), NOW() );