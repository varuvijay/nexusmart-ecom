
package com.ecommerce.helper;

import java.io.IOException;
import java.util.Arrays;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;

import jakarta.annotation.PostConstruct;

@Component
public class CloudinaryHelper {

    @Value("${cloudinary.api.name}")
    private String name;

    @Value("${cloudinary.api.key}")
    private String key;

    @Value("${cloudinary.api.secret}")
    private String secret;

    private Cloudinary cloudinary;

    @PostConstruct
    public void init() {
        // Initialize cloudinary with configuration map
        cloudinary = new Cloudinary(ObjectUtils.asMap(
                "cloud_name", name,
                "api_key", key,
                "api_secret", secret
        ));
    }

    public String saveImage(MultipartFile image) {
        if (cloudinary == null) {
            throw new RuntimeException("Cloudinary not properly initialized");
        }

        try {
            byte[] picture = new byte[image.getInputStream().available()];
            image.getInputStream().read(picture);

            return (String) cloudinary.uploader()
                    .upload(picture, ObjectUtils.asMap("folder", "ecommerce"))
                    .get("url");

        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }
    }

    public String deleteImage(String imageUrl) {
        if (cloudinary == null) {
            throw new RuntimeException("Cloudinary not properly initialized");
        }

        try {
            String[] id = imageUrl.split("/");
            String[] idd = id[id.length-1].split("\\.");
            String publicIDD = id[id.length-2] + "/" + idd[0];

            Map result = cloudinary.uploader().destroy(publicIDD, ObjectUtils.emptyMap());
            return result.get("result").toString();
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }
    }
}