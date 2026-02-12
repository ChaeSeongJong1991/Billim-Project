# [수정된 Dockerfile]
# 빌드 과정 없이, 가벼운 실행 환경만 준비합니다.
FROM amazoncorretto:21-alpine-jdk

WORKDIR /app

# 아까 윈도우에서 미리 빌드한 파일을 복사합니다.
# (dockerignore 설정 덕분에 다른 파일은 무시되고 jar만 들어갑니다)
COPY build/libs/*.jar app.jar

# 실행
ENTRYPOINT ["java", "-jar", "app.jar"]