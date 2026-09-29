#version 330 core

uniform vec2 u_resolution;
uniform float u_time;

out vec4 fragColor;

// (Math & Randomness)
float rand(inout float seed) {
    float result = fract(sin(seed) * 43758.5453123);
    seed += 1.0;
    return result;
}

vec3 random_unit_vector(inout float seed) {
    // Rejection sampling for a random vector in a unit sphere
    for(int i = 0; i < 10; i++) {
        vec3 p = vec3(rand(seed), rand(seed), rand(seed)) * 2.0 - 1.0;
        if(dot(p, p) < 1.0) return normalize(p);
    }
    return vec3(0.0, 1.0, 0.0); // Fallback
}

struct Ray {
    vec3 origin;
    vec3 direction;
};

vec3 ray_at(Ray r, float t) {
    return r.origin + t * r.direction;
}

// Materials: 0 = Lambertian (Diffuse), 1 = Metal (Reflective)
struct Material {
    int type;
    vec3 albedo;
    float fuzz;
};

struct HitRecord {
    float t;
    vec3 p;
    vec3 normal;
    bool front_face;
    Material mat;
};

// MILESTONE 1: THE INTERSECTION

bool hit_sphere(Ray r, vec3 center, float radius, Material mat, float t_min, float t_max, out HitRecord rec) {
    // TODO: Implement the quadratic formula for ray-sphere intersection.
    // If a hit occurs between t_min and t_max:
    //   1. Fill the 'rec' struct with t, p, normal, and mat.
    //   2. Return true.
    // Otherwise, return false.
    vec3 oc = r.origin - center; //origin to center of sphere wala vector
    float a = dot(r.direction, r.direction); //r.direction because o+td wala d is unit vector/direction
    float b = 2.0 * dot(r.direction, oc);
    float c = dot(oc, oc) - radius * radius;
    float discriminant = b * b - 4.0 * a * c;

    if (discriminant < 0.0) {
        return false;
    }

    float sqrtd = sqrt(discriminant);
    float root = (-b - sqrtd) / (2.0 * a); //by default take the smaller root cause thats where the ray enters from
    //still check if it lies in our rendering range; if it doesn't-we take the bigger root and do a check on it too

    if (root <= t_min || root >= t_max) {
        root = (-b + sqrtd) / (2.0 * a);
        if (root <= t_min || root >= t_max) {
            return false;
        }
    }

    rec.t = root;
    rec.p = ray_at(r, rec.t);
    rec.normal = (rec.p - center) / radius;
    rec.mat = mat;

    return true; 
}

bool hit_world(Ray r, out HitRecord rec) {
    bool hit_anything = false;
    float closest_so_far = 10000.0;
    HitRecord temp_rec;

    // Hardcoded scene
    Material mat_ground = Material(0, vec3(0.8, 0.8, 0.0), 0.0);
    Material mat_center = Material(0, vec3(0.7, 0.3, 0.3), 0.0);
    Material mat_left   = Material(1, vec3(0.8, 0.8, 0.8), 0.3); // Metal
    Material mat_right  = Material(1, vec3(0.8, 0.6, 0.2), 0.0); // Metal

    // TODO: Call hit_sphere for each of the 4 spheres below. 
    // update closest_so_far and hit_anything whenever a closer sphere is hit.
    // Sphere 1: Center (0.0, -100.5, -1.0), Radius 100.0, mat_ground
    // Sphere 2: Center (0.0, 0.0, -1.0),    Radius 0.5,   mat_center
    // Sphere 3: Center (-1.0, 0.0, -1.0),   Radius 0.5,   mat_left
    // Sphere 4: Center (1.0, 0.0, -1.0),    Radius 0.5,   mat_right

    // Sphere 1: Ground
    if (hit_sphere(r, vec3(0.0, -100.5, -1.0), 100.0, mat_ground, 0.001, closest_so_far, temp_rec)) {
        hit_anything = true;
        closest_so_far = temp_rec.t;
        rec = temp_rec;
    }

    // Sphere 2: Center
    if (hit_sphere(r, vec3(0.0+sin(u_time), 0.0, -1.0+cos(u_time)), 0.5, mat_center, 0.001, closest_so_far, temp_rec)) {
        hit_anything = true;
        closest_so_far = temp_rec.t;
        rec = temp_rec;
    }

    // Sphere 3: Left
    if (hit_sphere(r, vec3(-1.0, 0.0, -1.0), 0.5, mat_left, 0.001, closest_so_far, temp_rec)) {
        hit_anything = true;
        closest_so_far = temp_rec.t;
        rec = temp_rec;
    }

    // Sphere 4: Right
    if (hit_sphere(r, vec3(1.0, 0.0, -1.0), 0.5, mat_right, 0.001, closest_so_far, temp_rec)) {
        hit_anything = true;
        closest_so_far = temp_rec.t;
        rec = temp_rec;
    }

    return hit_anything;
}

// MILESTONE 2: LIGHT TRANSPORT (THE RAY TRACER)

vec3 ray_color(Ray r, inout float seed) {
    vec3 final_color = vec3(0.0);
    vec3 attenuation = vec3(1.0);
    
    // We cannot use recursion in GLSL, so we loop for a maximum of 4 bounces.
    for (int i = 0; i < 4; i++) {
        HitRecord rec;
        if (hit_world(r, rec)) {
            vec3 target_direction;
            // TODO: Implement material scattering!
            // 1. If rec.mat.type == 0 (Lambertian):
            //      Calculate diffuse bounce direction.
            if (rec.mat.type == 0) {
            target_direction = rec.normal + random_unit_vector(seed); }

            // 2. If rec.mat.type == 1 (Metal):
            //      Calculate reflection vector (add fuzz).
else if (rec.mat.type==1){
    vec3 reflected = reflect(normalize(r.direction), rec.normal);
target_direction = reflected + rec.mat.fuzz * random_unit_vector(seed);}
            
            // 3. Update the ray 'r' with the new origin (rec.p) and new direction.
            r.origin = rec.p;
    r.direction = normalize(target_direction);
            // 4. Multiply 'attenuation' by rec.mat.albedo.
            attenuation *= rec.mat.albedo;

        } else {
            // Sky gradient (We hit nothing!)
            vec3 unit_direction = normalize(r.direction);
            float t = 0.5 * (unit_direction.y + 1.0);
            vec3 sky = mix(vec3(1.0, 1.0, 1.0), vec3(0.5, 0.7, 1.0), t);
            
            final_color = attenuation * sky;
            break; // Stop bouncing, we flew off into the sky.
        }
    }
    
    return final_color;
}

// MAIN RENDERER (Anti-Aliasing setup)

void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / u_resolution.y;
    
    // Generate a unique random seed for this exact pixel and time
    float seed = gl_FragCoord.x * 19.19 + gl_FragCoord.y * 71.71 + u_time * 113.13;
    
    // Camera setup
    vec3 origin = vec3(0.0, 0.0, 0.0);
    
    vec3 pixel_color = vec3(0.0);
    int samples_per_pixel = 1000;
    
    // Accumulate light for multiple samples to create anti-aliasing
    for(int s = 0; s < samples_per_pixel; s++) {
        // Jitter the UV slightly for anti-aliasing
        vec2 jittered_uv = uv + vec2(rand(seed), rand(seed)) * 0.002;
        vec3 direction = normalize(vec3(jittered_uv, -1.0));
        
        Ray r = Ray(origin, direction);
        pixel_color += ray_color(r, seed);
    }
    
    // Average the samples and apply Gamma 2.0 correction
    pixel_color /= float(samples_per_pixel);
    pixel_color = sqrt(pixel_color);
    
    fragColor = vec4(pixel_color, 1.0);
}