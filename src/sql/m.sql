INSERT INTO m_user( `username`, `password`, `first_name`, `last_name`, `permission` ) VALUES( 'admin', '1234', '', '', 2  );

INSERT INTO m_site ( `id`, `parent_id`, `name`, `value` ) VALUES ( 1, null, 'site', null);
INSERT INTO m_site ( `id`, `parent_id`, `name`, `value` ) VALUES ( 2, 1, 'url', 'http://www.something.com'  );
INSERT INTO m_site ( `id`, `parent_id`, `name`, `value` ) VALUES ( 3, 1, 'ip', '123,23,23,4'  );
INSERT INTO m_site ( `id`, `parent_id`, `name`, `value` ) VALUES ( 4, null, 'meta', null );
INSERT INTO m_site ( `id`, `parent_id`, `name`, `value` ) VALUES ( 5, 4, 'title', 'Something'  );
INSERT INTO m_site ( `id`, `parent_id`, `name`, `value` ) VALUES ( 6, 4, 'description', 'Something'  );
INSERT INTO m_site ( `id`, `parent_id`, `name`, `value` ) VALUES ( 7, 4, 'contact_email', 'admin@something.com'  );
INSERT INTO m_site ( `id`, `parent_id`, `name`, `value` ) VALUES ( 8, null, 'sns', null  );
INSERT INTO m_site ( `id`, `parent_id`, `name`, `value` ) VALUES ( 9, 7, 'facebook', 0  );
INSERT INTO m_site ( `id`, `parent_id`, `name`, `value` ) VALUES ( 10, 7, 'instagram', 0  );

INSERT INTO m_post_content_type ( `id`, `name`, `component_name` ) VALUES ( 1, 'text', 'text' );
INSERT INTO m_post_content_type ( `id`, `name`, `component_name` ) VALUES ( 2, 'long-text', 'long-text' );
INSERT INTO m_post_content_type ( `id`, `name`, `component_name` ) VALUES ( 3, 'rich-text', 'rxt' );

INSERT INTO m_post_type ( `id`, `name`, `name_singular`, `name_plural`, `type`, `support_audio`, `support_document`, `support_image`, `support_other`, `support_post`, `support_video` ) VALUES ( 1, 'About', 'Component', 'Components', 1, 0, 0, 1, 0, 0, 0 );

INSERT INTO m_post_meta ( `id`, `post_type_id`, `field`, `data_type`, `display` ) VALUES ( 1, 1, 'Description', 'text', 1 );
INSERT INTO m_post_meta ( `id`, `post_type_id`, `field`, `data_type`, `display` ) VALUES ( 2, 1, 'Alt Tag', 'text', 1 );

INSERT INTO m_post_type ( `id`, `name`, `name_singular`, `name_plural`, `type`, `support_audio`, `support_document`, `support_image`, `support_other`, `support_post`, `support_video` ) VALUES ( 2, 'Media', 'Media', 'Medias', 1, 0, 0, 1, 0, 0, 0 );



-- create post meta
INSERT INTO m_post_meta ( `id`, `post_type_id`, `field`, `data_type`, `display` ) VALUES ( 3, 2, 'Description', 'text', 1 );
INSERT INTO m_post_meta ( `id`, `post_type_id`, `field`, `data_type`, `display` ) VALUES ( 4, 2, 'Alt Tag', 'text', 1 );

INSERT INTO m_post_data_type ( `id`, `name` ) VALUES ( 1, 'root_folder' );
INSERT INTO m_post_data_type ( `id`, `name` ) VALUES ( 2, 'folder' );
INSERT INTO m_post_data_type ( `id`, `name` ) VALUES ( 3, 'image' );
INSERT INTO m_post_data_type ( `id`, `name` ) VALUES ( 4, 'text' );
INSERT INTO m_post_data_type ( `id`, `name` ) VALUES ( 5, 'audio' );
INSERT INTO m_post_data_type ( `id`, `name` ) VALUES ( 6, 'video' );
INSERT INTO m_post_data_type ( `id`, `name` ) VALUES ( 7, 'post' );
INSERT INTO m_post_data_type ( `id`, `name` ) VALUES ( 8, 'application' );
INSERT INTO m_post_data_type ( `id`, `name` ) VALUES ( 9, 'other' );



-- INSERT INTO m_post ( `id`, `parent_id`, `user_id`, `post_type_id`, `post_data_type_id`, `name`, `container`, `public` ) VALUES ( null, null, 1, 2, 1, 'aerfaerf', 1, 0 );
--
-- SELECT * FROM m_post_data;
SELECT * FROM m_post;
