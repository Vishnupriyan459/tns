package com.tns.certificateservice;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/certificates")
public class CertificateController {

    @Autowired
    private CertificateService certificateService;

    @GetMapping
    public List<Certificate> getAllCertificates() {
        return certificateService.getAllCertificates();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Certificate> getCertificateById(@PathVariable Long id) {
        return certificateService.getCertificateById(id)
            .map(ResponseEntity::ok)
            .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public Certificate createCertificate(@RequestBody Certificate certificate) {
        return certificateService.saveCertificate(certificate);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Certificate> updateCertificate(
            @PathVariable Long id, @RequestBody Certificate certificateDetails) {
        return certificateService.getCertificateById(id)
            .map(certificate -> {
                certificate.setStudentName(certificateDetails.getStudentName());
                certificate.setCourseName(certificateDetails.getCourseName());
                certificate.setIssuedDate(certificateDetails.getIssuedDate());
                return ResponseEntity.ok(certificateService.saveCertificate(certificate));
            })
            .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCertificate(@PathVariable Long id) {
        certificateService.deleteCertificate(id);
        return ResponseEntity.ok().build();
    }
}
